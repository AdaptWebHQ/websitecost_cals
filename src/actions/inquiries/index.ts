'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { contactFormSchema, inquiryUpdateSchema, type ContactFormData, type InquiryUpdateData } from '@/schemas';
import { sendEmailNotification } from '@/lib/email';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Inquiry, InquiryActivity, InquiryStatus } from '@/types';

/** Create a new CRM lead Inquiry, optionally linked to a quotation Calculation ID */
export async function createInquiryAction(
  data: ContactFormData,
  calculationId?: string
): Promise<ApiResponse<Inquiry>> {
  try {
    const validated = contactFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const { name, company, email, phone, budget, message } = validated.data;
    const now = new Date();

    const newInquiry: Omit<Inquiry, 'id'> = {
      calculationId: calculationId || null,
      name,
      companyName: company,
      email,
      phone,
      budget,
      message,
      status: 'new' as InquiryStatus,
      assignedTo: null,
      followUpDate: null,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.INQUIRIES).add(newInquiry);
    const inquiryId = docRef.id;

    // Log initial activity event
    const initialActivity: Omit<InquiryActivity, 'id'> = {
      inquiryId,
      action: 'Inquiry Submitted',
      note: `Contact form submitted. Budget range: ${budget}`,
      createdBy: 'System',
      createdAt: now,
    };
    await adminDb.collection(COLLECTIONS.INQUIRY_ACTIVITIES).add(initialActivity);

    // Send email alert to admin/staff dynamically using price config email
    const priceConfigDoc = await adminDb.collection(COLLECTIONS.PRICE_CONFIG).doc('global').get();
    const adminEmail = priceConfigDoc.data()?.companyEmail || process.env.ADMIN_NOTIFY_EMAIL || 'admin@webcostpro.com';

    const emailSubject = `New CRM Lead Inquiry: ${company} (${name})`;
    const emailHtml = `
      <h2>New Calculator Lead Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background:#f1f5f9;padding:10px 15px;border-left:4px solid #6366f1;">
        ${message}
      </blockquote>
      ${calculationId ? `<p><strong>Linked Calculation ID:</strong> <a href="/dashboard/admin/calculations/${calculationId}">${calculationId}</a></p>` : ''}
      <p><a href="/dashboard/admin/inquiries/${inquiryId}">Open Lead in CRM Portal</a></p>
    `;

    await sendEmailNotification(adminEmail, emailSubject, emailHtml);

    revalidatePath('/dashboard/admin/inquiries');

    return {
      success: true,
      data: {
        id: inquiryId,
        ...newInquiry,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating CRM lead:', error);
    return {
      success: false,
      error: 'Failed to submit inquiry. Please try again.',
    };
  }
}

/** Update CRM Lead status / assignee details */
export async function updateInquiryStatusAction(
  id: string,
  updateData: InquiryUpdateData
): Promise<ApiResponse<Inquiry>> {
  try {
    const validated = inquiryUpdateSchema.safeParse(updateData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const { status, assignedTo, followUpDate, note } = validated.data;
    
    const user = await getServerUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized. Admin access required.',
      };
    }

    const inqRef = adminDb.collection(COLLECTIONS.INQUIRIES).doc(id);
    const docSnap = await inqRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Inquiry not found.',
      };
    }

    const oldData = docSnap.data();
    const now = new Date();

    const updatedFields: Partial<Inquiry> = {
      status: status as InquiryStatus,
      assignedTo: assignedTo || null,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      updatedAt: now,
    };

    await inqRef.update(updatedFields);

    // Create activity logs for audit trails
    const activities: Omit<InquiryActivity, 'id'>[] = [];

    if (oldData?.status !== status) {
      activities.push({
        inquiryId: id,
        action: 'Status Updated',
        note: `Status changed from "${oldData?.status}" to "${status}".`,
        createdBy: user.name,
        createdAt: now,
      });
    }

    if (note) {
      activities.push({
        inquiryId: id,
        action: 'Admin Comment Added',
        note,
        createdBy: user.name,
        createdAt: now,
      });
    }

    // Save activity logs
    if (activities.length > 0) {
      const batch = adminDb.batch();
      activities.forEach((act) => {
        const actRef = adminDb.collection(COLLECTIONS.INQUIRY_ACTIVITIES).doc();
        batch.set(actRef, act);
      });
      await batch.commit();
    }

    revalidatePath('/dashboard/admin/inquiries');
    revalidatePath(`/dashboard/admin/inquiries/${id}`);

    const currentDoc = await inqRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
        followUpDate: currentData?.followUpDate?.toDate() || null,
      } as Inquiry,
    };
  } catch (error: unknown) {
    console.error('Error updating inquiry status:', error);
    return {
      success: false,
      error: 'Failed to update lead. Please try again.',
    };
  }
}

/** Add a text comment / activity directly to the CRM Lead */
export async function addInquiryNoteAction(
  inquiryId: string,
  content: string
): Promise<ApiResponse<InquiryActivity>> {
  try {
    const user = await getServerUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized.',
      };
    }

    if (!content.trim()) {
      return {
        success: false,
        error: 'Comment cannot be empty.',
      };
    }

    const now = new Date();
    const newActivity: Omit<InquiryActivity, 'id'> = {
      inquiryId,
      action: 'Admin Comment Added',
      note: content,
      createdBy: user.name,
      createdAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.INQUIRY_ACTIVITIES).add(newActivity);
    
    // Touch inquiry update date
    await adminDb.collection(COLLECTIONS.INQUIRIES).doc(inquiryId).update({
      updatedAt: now,
    });

    revalidatePath(`/dashboard/admin/inquiries/${inquiryId}`);

    return {
      success: true,
      data: {
        id: docRef.id,
        ...newActivity,
      },
    };
  } catch (error: unknown) {
    console.error('Error adding activity log:', error);
    return {
      success: false,
      error: 'Failed to save comment.',
    };
  }
}
