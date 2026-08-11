import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getCache, setCache } from '@/lib/server-cache';
import type { DashboardStats, ChartDataPoint, MonthlyData } from '@/types';

// ============================================================================
// Analytics Aggregation Services (Cached for 300 seconds / 5 minutes)
// ============================================================================

const CACHE_TTL = 300; // 5 minutes

/** Fetch high-level summary KPIs for the admin dashboard */
export async function getDashboardStats(): Promise<DashboardStats> {
  const cacheKey = 'analytics:dashboard_stats';
  const cached = getCache<DashboardStats>(cacheKey);
  if (cached) return cached;

  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    const inquiriesSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).get();

    const totalCalculations = calculationsSnap.size;
    const totalLeads = inquiriesSnap.size;

    if (totalCalculations === 0) {
      const emptyStats = {
        totalCalculations: 0,
        todayCalculations: 0,
        totalLeads: 0,
        bookedProjects: 0,
        conversionRate: 0,
        averageProjectValue: 0,
        revenuePipeline: 0,
        averageQuoteValue: 0,
        convertedLeads: 0,
        hotLeads: 0,
        coldLeads: 0,
      };
      setCache(cacheKey, emptyStats, CACHE_TTL);
      return emptyStats;
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

    const convertedLeads = bookedProjects;
    const hotLeads = inquiries.filter((l) => ['contacted', 'proposal_sent', 'negotiation'].includes(l.status)).length;
    const coldLeads = inquiries.filter((l) => ['new', 'inquired'].includes(l.status)).length;

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

    const stats: DashboardStats = {
      totalCalculations,
      todayCalculations,
      totalLeads,
      bookedProjects,
      conversionRate,
      averageProjectValue,
      revenuePipeline: pipeline,
      averageQuoteValue,
      convertedLeads,
      hotLeads,
      coldLeads,
    };

    setCache(cacheKey, stats, CACHE_TTL);
    return stats;
  } catch (error) {
    return {
      totalCalculations: 0,
      todayCalculations: 0,
      totalLeads: 0,
      bookedProjects: 0,
      conversionRate: 0,
      averageProjectValue: 0,
      revenuePipeline: 0,
      averageQuoteValue: 0,
      convertedLeads: 0,
      hotLeads: 0,
      coldLeads: 0,
    };
  }
}

/** Fetch data points for monthly calculations and revenues */
export async function getMonthlyCalculations(): Promise<MonthlyData[]> {
  const cacheKey = 'analytics:monthly_calculations';
  const cached = getCache<MonthlyData[]>(cacheKey);
  if (cached) return cached;

  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      setCache(cacheKey, [], CACHE_TTL);
      return [];
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

    setCache(cacheKey, result, CACHE_TTL);
    return result;
  } catch (error) {
    return [];
  }
}

/** Fetch lead distribution by status */
export async function getLeadStatusDistribution(): Promise<ChartDataPoint[]> {
  const cacheKey = 'analytics:lead_status_distribution';
  const cached = getCache<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const inquiriesSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).get();
    if (inquiriesSnap.empty) {
      setCache(cacheKey, [], CACHE_TTL);
      return [];
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

    const result = Object.entries(counts).map(([status, val]) => ({
      label: status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: val,
      color: colors[status] || '#64748B',
    }));

    setCache(cacheKey, result, CACHE_TTL);
    return result;
  } catch (error) {
    return [];
  }
}

/** Fetch calculations distribution by industry */
export async function getIndustryDistribution(): Promise<ChartDataPoint[]> {
  const cacheKey = 'analytics:industry_distribution';
  const cached = getCache<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      setCache(cacheKey, [], CACHE_TTL);
      return [];
    }

    const counts: Record<string, number> = {};
    calculationsSnap.docs.forEach((doc) => {
      const industry = doc.data().industryName || 'Other';
      counts[industry] = (counts[industry] || 0) + 1;
    });

    const colorPalette = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    const result = Object.entries(counts).map(([ind, val], idx) => ({
      label: ind,
      value: val,
      color: colorPalette[idx % colorPalette.length],
    }));

    setCache(cacheKey, result, CACHE_TTL);
    return result;
  } catch (error) {
    return [];
  }
}

/** Fetch package popularity statistics */
export async function getPackagePopularity(): Promise<ChartDataPoint[]> {
  const cacheKey = 'analytics:package_popularity';
  const cached = getCache<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      setCache(cacheKey, [], CACHE_TTL);
      return [];
    }

    const counts: Record<string, number> = {};
    calculationsSnap.docs.forEach((doc) => {
      const pack = doc.data().packageName || 'Custom';
      counts[pack] = (counts[pack] || 0) + 1;
    });

    const colorPalette = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];

    const result = Object.entries(counts).map(([pack, val], idx) => ({
      label: pack,
      value: val,
      color: colorPalette[idx % colorPalette.length],
    }));

    setCache(cacheKey, result, CACHE_TTL);
    return result;
  } catch (error) {
    return [];
  }
}

/** Fetch feature usage counts */
export async function getFeatureUsage(): Promise<ChartDataPoint[]> {
  const cacheKey = 'analytics:feature_usage';
  const cached = getCache<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    if (calculationsSnap.empty) {
      setCache(cacheKey, [], CACHE_TTL);
      return [];
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

    const result = sorted.map(([feat, val], idx) => ({
      label: feat,
      value: val,
      color: colorPalette[idx % colorPalette.length],
    }));

    setCache(cacheKey, result, CACHE_TTL);
    return result;
  } catch (error) {
    return [];
  }
}

/** Fetch conversion funnel stages statistics */
export async function getConversionFunnel(): Promise<ChartDataPoint[]> {
  const cacheKey = 'analytics:conversion_funnel';
  const cached = getCache<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const calculationsSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).get();
    const inquiriesSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).get();

    if (calculationsSnap.empty) {
      const emptyFunnel = [
        { label: 'Calculations', value: 0 },
        { label: 'Leads', value: 0 },
        { label: 'Contacted', value: 0 },
        { label: 'Booked', value: 0 },
      ];
      setCache(cacheKey, emptyFunnel, CACHE_TTL);
      return emptyFunnel;
    }

    const totalCalculations = calculationsSnap.size;
    const totalLeads = inquiriesSnap.size;

    const inquiries = inquiriesSnap.docs.map((doc) => doc.data());
    const contacted = inquiries.filter((l) => l.status !== 'new' && l.status !== 'inquired').length;
    const booked = inquiries.filter((l) => l.status === 'booked').length;

    const funnel = [
      { label: 'Calculations', value: totalCalculations },
      { label: 'Leads', value: totalLeads },
      { label: 'Contacted', value: contacted },
      { label: 'Booked', value: booked },
    ];

    setCache(cacheKey, funnel, CACHE_TTL);
    return funnel;
  } catch (error) {
    return [
      { label: 'Calculations', value: 0 },
      { label: 'Leads', value: 0 },
      { label: 'Contacted', value: 0 },
      { label: 'Booked', value: 0 },
    ];
  }
}
