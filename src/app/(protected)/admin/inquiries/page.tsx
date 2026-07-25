import InquiriesDashboard from '@/components/admin/inquiries-dashboard';
import { getInquiriesPage } from '@/lib/inquiries';

export const revalidate = 0;

export default async function AdminInquiriesPage() {
  const page = await getInquiriesPage({ limit: 25 });

  return (
    <InquiriesDashboard
      initialInquiries={page.items.map((item) => ({
        ...item,
        createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
      }))}
      initialNextCursor={page.nextCursor}
      initialHasMore={page.hasMore}
    />
  );
}
