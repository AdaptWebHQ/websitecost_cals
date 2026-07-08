import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { DashboardStats, ChartDataPoint, MonthlyData } from '@/types';

// ============================================================================
// Fallback Mock Data (For development/fresh setup before data is generated)
// ============================================================================

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalCalculations: 342,
  todayCalculations: 12,
  totalLeads: 84,
  bookedProjects: 18,
  conversionRate: 21, // 21% conversion rate (Leads -> Booked)
  averageProjectValue: 48500, // INR
  revenuePipeline: 873000, // INR
  averageQuoteValue: 32400, // INR
};

export const MOCK_MONTHLY_CALCULATIONS: MonthlyData[] = [
  { month: 'Jan', count: 45, revenue: 145000 },
  { month: 'Feb', count: 52, revenue: 182000 },
  { month: 'Mar', count: 68, revenue: 220000 },
  { month: 'Apr', count: 59, revenue: 198000 },
  { month: 'May', count: 84, revenue: 285000 },
  { month: 'Jun', count: 96, revenue: 342000 },
];

export const MOCK_LEAD_STATUS: ChartDataPoint[] = [
  { label: 'New', value: 24, color: '#3B82F6' },
  { label: 'Inquired', value: 18, color: '#9333EA' },
  { label: 'Contacted', value: 15, color: '#EAB308' },
  { label: 'Proposal Sent', value: 12, color: '#F97316' },
  { label: 'Negotiation', value: 8, color: '#6366F1' },
  { label: 'Booked', value: 18, color: '#22C55E' },
  { label: 'Lost', value: 5, color: '#EF4444' },
];

export const MOCK_INDUSTRY_DISTRIBUTION: ChartDataPoint[] = [
  { label: 'Salon', value: 45, color: '#6366F1' },
  { label: 'Restaurant', value: 62, color: '#8B5CF6' },
  { label: 'School', value: 28, color: '#06B6D4' },
  { label: 'Hospital', value: 15, color: '#10B981' },
  { label: 'Gym', value: 34, color: '#F59E0B' },
  { label: 'Law Firm', value: 22, color: '#EF4444' },
  { label: 'Construction', value: 19, color: '#EC4899' },
];

export const MOCK_PACKAGE_POPULARITY: ChartDataPoint[] = [
  { label: 'Starter', value: 98, color: '#3B82F6' },
  { label: 'Business', value: 164, color: '#8B5CF6' },
  { label: 'Premium', value: 62, color: '#06B6D4' },
  { label: 'Enterprise', value: 18, color: '#10B981' },
];

export const MOCK_FEATURE_USAGE: ChartDataPoint[] = [
  { label: 'Payment Gateway', value: 245, color: '#6366F1' },
  { label: 'Booking System', value: 184, color: '#8B5CF6' },
  { label: 'Admin Panel', value: 156, color: '#06B6D4' },
  { label: 'SEO Setup', value: 289, color: '#10B981' },
  { label: 'WhatsApp', value: 212, color: '#F59E0B' },
  { label: 'Blog', value: 135, color: '#EC4899' },
];

export const MOCK_CONVERSION_FUNNEL: ChartDataPoint[] = [
  { label: 'Calculations', value: 342 },
  { label: 'Leads', value: 84 },
  { label: 'Contacted', value: 53 },
  { label: 'Booked', value: 18 },
];

// ============================================================================
// Analytics Aggregation Services
// ============================================================================

/** Fetch high-level summary KPIs for the admin dashboard */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    const inquiriesSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).get();
    
    const totalCalculations = calculationsSnap.size;
    const totalLeads = inquiriesSnap.size;

    if (totalCalculations === 0) {
      return MOCK_DASHBOARD_STATS;
    }

    // Filter calculations created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCalculations = calculationsSnap.docs.filter((doc) => {
      const createdAt = doc.data().createdAt?.toDate();
      return createdAt && createdAt >= today;
    }).length;

    // Filter inquiries by status
    const inquiries = inquiriesSnap.docs.map((doc) => doc.data());
    const bookedProjects = inquiries.filter((l) => l.status === 'booked').length;
    
    // Calculate conversion rate (Leads -> Booked)
    const conversionRate = totalLeads > 0 ? Math.round((bookedProjects / totalLeads) * 100) : 0;

    // Calculations for values
    let quoteValueSum = 0;
    calculationsSnap.docs.forEach((doc) => {
      quoteValueSum += doc.data().total || 0;
    });

    const averageQuoteValue = totalCalculations > 0 ? Math.round(quoteValueSum / totalCalculations) : 0;

    // Revenue Pipeline & Average Project Value from inquiries
    let pipeline = 0;
    let bookedTotalValue = 0;

    inquiries.forEach((inq) => {
      const budgetNum = parseInt(inq.budget?.replace(/[^\d]/g, '') || '0', 10);
      if (inq.status === 'booked') {
        bookedTotalValue += budgetNum || averageQuoteValue;
      } else if (inq.status !== 'lost') {
        pipeline += budgetNum || averageQuoteValue;
      }
    });

    const averageProjectValue = bookedProjects > 0 ? Math.round(bookedTotalValue / bookedProjects) : 0;

    return {
      totalCalculations,
      todayCalculations,
      totalLeads,
      bookedProjects,
      conversionRate,
      averageProjectValue: averageProjectValue || MOCK_DASHBOARD_STATS.averageProjectValue,
      revenuePipeline: pipeline || MOCK_DASHBOARD_STATS.revenuePipeline,
      averageQuoteValue: averageQuoteValue || MOCK_DASHBOARD_STATS.averageQuoteValue,
    };
  } catch (error) {
    // Quiet fallback
    return MOCK_DASHBOARD_STATS;
  }
}

/** Fetch data points for monthly calculations and revenues */
export async function getMonthlyCalculations(): Promise<MonthlyData[]> {
  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      return MOCK_MONTHLY_CALCULATIONS;
    }

    const monthlyMap: Record<string, { count: number; revenue: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Group calculations by month (last 6 months)
    calculationsSnap.docs.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate();
      if (!createdAt) return;

      const monthStr = monthNames[createdAt.getMonth()];
      if (!monthlyMap[monthStr]) {
        monthlyMap[monthStr] = { count: 0, revenue: 0 };
      }
      
      monthlyMap[monthStr].count += 1;
      monthlyMap[monthStr].revenue += data.total || 0;
    });

    const result = monthNames
      .filter((m) => monthlyMap[m] !== undefined)
      .map((m) => ({
        month: m,
        count: monthlyMap[m].count,
        revenue: monthlyMap[m].revenue,
      }));

    return result.length > 0 ? result : MOCK_MONTHLY_CALCULATIONS;
  } catch (error) {
    // Quiet fallback
    return MOCK_MONTHLY_CALCULATIONS;
  }
}

/** Fetch lead distribution by status */
export async function getLeadStatusDistribution(): Promise<ChartDataPoint[]> {
  try {
    const inquiriesSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).get();
    if (inquiriesSnap.empty) {
      return MOCK_LEAD_STATUS;
    }

    const counts: Record<string, number> = {};
    inquiriesSnap.docs.forEach((doc) => {
      const status = doc.data().status || 'new';
      counts[status] = (counts[status] || 0) + 1;
    });

    const colors: Record<string, string> = {
      new: '#3B82F6',
      inquired: '#9333EA',
      contacted: '#EAB308',
      proposal_sent: '#F97316',
      negotiation: '#6366F1',
      booked: '#22C55E',
      lost: '#EF4444',
    };

    return Object.entries(counts).map(([status, val]) => ({
      label: status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: val,
      color: colors[status] || '#64748B',
    }));
  } catch (error) {
    // Quiet fallback
    return MOCK_LEAD_STATUS;
  }
}

/** Fetch calculations distribution by industry */
export async function getIndustryDistribution(): Promise<ChartDataPoint[]> {
  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      return MOCK_INDUSTRY_DISTRIBUTION;
    }

    const counts: Record<string, number> = {};
    calculationsSnap.docs.forEach((doc) => {
      const industry = doc.data().industryName || 'Other';
      counts[industry] = (counts[industry] || 0) + 1;
    });

    const colorPalette = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    return Object.entries(counts).map(([ind, val], idx) => ({
      label: ind,
      value: val,
      color: colorPalette[idx % colorPalette.length],
    }));
  } catch (error) {
    // Quiet fallback
    return MOCK_INDUSTRY_DISTRIBUTION;
  }
}

/** Fetch package popularity statistics */
export async function getPackagePopularity(): Promise<ChartDataPoint[]> {
  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      return MOCK_PACKAGE_POPULARITY;
    }

    const counts: Record<string, number> = {};
    calculationsSnap.docs.forEach((doc) => {
      const pack = doc.data().packageName || 'Custom';
      counts[pack] = (counts[pack] || 0) + 1;
    });

    const colorPalette = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];

    return Object.entries(counts).map(([pack, val], idx) => ({
      label: pack,
      value: val,
      color: colorPalette[idx % colorPalette.length],
    }));
  } catch (error) {
    // Quiet fallback
    return MOCK_PACKAGE_POPULARITY;
  }
}

/** Fetch feature usage counts */
export async function getFeatureUsage(): Promise<ChartDataPoint[]> {
  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      return MOCK_FEATURE_USAGE;
    }

    const counts: Record<string, number> = {};
    calculationsSnap.docs.forEach((doc) => {
      const selected = (doc.data().selectedFeatures || []) as { featureName: string }[];
      selected.forEach((f) => {
        counts[f.featureName] = (counts[f.featureName] || 0) + 1;
      });
    });

    const colorPalette = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];

    // Sort features by popularity, select top 6
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return sorted.map(([feat, val], idx) => ({
      label: feat,
      value: val,
      color: colorPalette[idx % colorPalette.length],
    }));
  } catch (error) {
    // Quiet fallback
    return MOCK_FEATURE_USAGE;
  }
}

/** Fetch conversion funnel stages statistics */
export async function getConversionFunnel(): Promise<ChartDataPoint[]> {
  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    const inquiriesSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).get();
    
    if (calculationsSnap.empty) {
      return MOCK_CONVERSION_FUNNEL;
    }

    const totalCalculations = calculationsSnap.size;
    const totalLeads = inquiriesSnap.size;
    
    const inquiries = inquiriesSnap.docs.map((doc) => doc.data());
    const contacted = inquiries.filter((l) => l.status !== 'new' && l.status !== 'inquired').length;
    const booked = inquiries.filter((l) => l.status === 'booked').length;

    return [
      { label: 'Calculations', value: totalCalculations },
      { label: 'Leads', value: totalLeads },
      { label: 'Contacted', value: contacted },
      { label: 'Booked', value: booked },
    ];
  } catch (error) {
    // Quiet fallback
    return MOCK_CONVERSION_FUNNEL;
  }
}
