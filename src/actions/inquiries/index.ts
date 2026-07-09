'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { contactFormSchema, inquiryUpdateSchema, type ContactFormData, type InquiryUpdateData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Inquiry, InquiryActivity, InquiryStatus, LeadTemperature } from '@/types';
import { sendInquiryEmail } from '@/lib/email';

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

    // Send email notification using Nodemailer directly from Next.js server actions
    try {
      await sendInquiryEmail({
        id: inquiryId,
        ...newInquiry,
      });
    } catch (mailError) {
      console.error('Failed to send inquiry email notification:', mailError);
    }

    revalidatePath('/admin/inquiries');

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

    const { status, temperature, assignedTo, followUpDate, note } = validated.data;
    
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

    if (temperature !== undefined) {
      updatedFields.temperature = temperature;
    }

    await inqRef.update(updatedFields);

    // Create activity logs for audit trails
    const activities: Omit<InquiryActivity, 'id'>[] = [];

    if (oldData?.status !== status) {
      activities.push({
        inquiryId: id,
        action: 'Status Updated',
        note: `Status changed from "${oldData?.status || 'None'}" to "${status}".`,
        createdBy: user.name,
        createdAt: now,
      });
    }

    if (temperature !== undefined && oldData?.temperature !== temperature) {
      activities.push({
        inquiryId: id,
        action: 'Temperature Updated',
        note: `Temperature changed from "${oldData?.temperature || 'None'}" to "${temperature}".`,
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

    revalidatePath('/admin/inquiries');
    revalidatePath(`/admin/inquiries/${id}`);

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

    revalidatePath(`/admin/inquiries/${inquiryId}`);

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

/** Delete an inquiry and its activities from Firestore */
export async function deleteInquiryAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized. Admin access required.',
      };
    }

    const db = adminDb;
    const inqRef = db.collection(COLLECTIONS.INQUIRIES).doc(id);
    const docSnap = await inqRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Inquiry not found.',
      };
    }

    // Delete the inquiry document
    await inqRef.delete();

    // Delete associated activities
    const activitiesSnap = await db
      .collection(COLLECTIONS.INQUIRY_ACTIVITIES)
      .where('inquiryId', '==', id)
      .get();

    if (!activitiesSnap.empty) {
      const batch = db.batch();
      activitiesSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    revalidatePath('/admin/inquiries');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return {
      success: false,
      error: 'Failed to delete inquiry. Please try again.',
    };
  }
}

/** Update only lead temperature and log activity */
export async function updateInquiryTemperatureAction(
  id: string,
  temperature: LeadTemperature
): Promise<ApiResponse<Inquiry>> {
  try {
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
      temperature,
      updatedAt: now,
    };

    await inqRef.update(updatedFields);

    // Create activity logs for audit trails
    if (oldData?.temperature !== temperature) {
      const act: Omit<InquiryActivity, 'id'> = {
        inquiryId: id,
        action: 'Temperature Updated',
        note: `Temperature changed from "${oldData?.temperature || 'None'}" to "${temperature}".`,
        createdBy: user.name,
        createdAt: now,
      };
      await adminDb.collection(COLLECTIONS.INQUIRY_ACTIVITIES).add(act);
    }

    revalidatePath('/admin/inquiries');
    revalidatePath(`/admin/inquiries/${id}`);

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
  } catch (error) {
    console.error('Error updating inquiry temperature:', error);
    return {
      success: false,
      error: 'Failed to update temperature. Please try again.',
    };
  }
}

