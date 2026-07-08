import {
  getDashboardStats,
  getMonthlyCalculations,
  getLeadStatusDistribution,
  getIndustryDistribution,
  getPackagePopularity,
  getFeatureUsage,
  getConversionFunnel,
} from '@/lib/analytics';
import StatCard from '@/components/shared/stat-card';
import MonthlyCalculationsChart from '@/components/charts/monthly-calculations-chart';
import LeadStatusChart from '@/components/charts/lead-status-chart';
import IndustryDistributionChart from '@/components/charts/industry-distribution-chart';
import PackagePopularityChart from '@/components/charts/package-popularity-chart';
import FeatureUsageChart from '@/components/charts/feature-usage-chart';
import RevenueChart from '@/components/charts/revenue-chart';
import ConversionFunnelChart from '@/components/charts/conversion-funnel-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, FileBarChart, Target } from 'lucide-react';

export const revalidate = 60; // Revalidate dashboard data every 60 seconds

export default async function AdminDashboardPage() {
  // Fetch statistics and chart data in parallel on the server
  const [
    stats,
    monthlyData,
    leadStatus,
    industryDist,
    packagePopularity,
    featureUsage,
    conversionFunnel,
  ] = await Promise.all([
    getDashboardStats(),
    getMonthlyCalculations(),
    getLeadStatusDistribution(),
    getIndustryDistribution(),
    getPackagePopularity(),
    getFeatureUsage(),
    getConversionFunnel(),
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Dashboard Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time summary of calculator activities, inquiries, and revenue metrics.
        </p>
      </div>

      {/* 1. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Calculations"
          value={stats.totalCalculations}
          iconName="Calculator"
          trend={{ value: '12% up', isPositive: true }}
          description="Lifetime calculator runs"
        />
        <StatCard
          label="Today's Runs"
          value={stats.todayCalculations}
          iconName="Clock"
          trend={{ value: stats.todayCalculations > 5 ? 'High' : 'Stable', isPositive: stats.todayCalculations > 5 }}
          description="Runs in the last 24h"
        />
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          iconName="MessageSquare"
          trend={{ value: '8.4%', isPositive: true }}
          description="Inquiry form completions"
        />
        <StatCard
          label="Booked Projects"
          value={stats.bookedProjects}
          iconName="CheckSquare"
          trend={{ value: '18% rate', isPositive: true }}
          description="Converted sales"
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          iconName="TrendingUp"
          trend={{ value: '2.5% increase', isPositive: true }}
          description="Leads converted to Booked"
        />
        <StatCard
          label="Average Project Value"
          value={formatCurrency(stats.averageProjectValue)}
          iconName="BadgeDollarSign"
          description="Based on booked values"
        />
        <StatCard
          label="Revenue Pipeline"
          value={formatCurrency(stats.revenuePipeline)}
          iconName="Coins"
          description="Value of active leads"
        />
        <StatCard
          label="Average Quote Value"
          value={formatCurrency(stats.averageQuoteValue)}
          iconName="FileBarChart"
          description="Estimated cost average"
        />
      </div>

      {/* 2. Charts Section - Row 1 (Monthly Calculations & Revenue Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Monthly Calculations
            </CardTitle>
            <CardDescription className="text-slate-500">
              Total number of quotation runs made over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <MonthlyCalculationsChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Monthly Revenue Pipeline
            </CardTitle>
            <CardDescription className="text-slate-500">
              Revenue generated from converted and booked quotes over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <RevenueChart data={monthlyData} />
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts Section - Row 2 (Lead Funnel & Pipeline status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-indigo-400" />
              Lead status breakdown
            </CardTitle>
            <CardDescription className="text-slate-500">
              Current breakdown of inquiries across CRM pipeline stages
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4 flex justify-center">
            <LeadStatusChart data={leadStatus} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400 animate-pulse" />
              Conversion Funnel
            </CardTitle>
            <CardDescription className="text-slate-500">
              Visitor drop-offs from runs to inquiries and sales
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <ConversionFunnelChart data={conversionFunnel} />
          </CardContent>
        </Card>
      </div>

      {/* 4. Charts Section - Row 3 (Demographics & Selections) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 lg:col-span-1">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white">
              Industry Demographics
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Estimates generated by business sectors
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4 flex justify-center">
            <IndustryDistributionChart data={industryDist} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 lg:col-span-1">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white">
              Package Popularity
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Distribution of Starter, Business, and Premium runs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <PackagePopularityChart data={packagePopularity} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 lg:col-span-1">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold text-white">
              Top Selected Features
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Most requested website additions in quotation steps
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <FeatureUsageChart data={featureUsage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
