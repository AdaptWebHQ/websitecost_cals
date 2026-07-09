import StatCard from '@/components/shared/stat-card';
import MonthlyCalculationsChart from '@/components/charts/monthly-calculations-chart';
import LeadStatusChart from '@/components/charts/lead-status-chart';
import IndustryDistributionChart from '@/components/charts/industry-distribution-chart';
import PackagePopularityChart from '@/components/charts/package-popularity-chart';
import FeatureUsageChart from '@/components/charts/feature-usage-chart';
import RevenueChart from '@/components/charts/revenue-chart';
import ConversionFunnelChart from '@/components/charts/conversion-funnel-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, FileBarChart, Target } from 'lucide-react';

interface AdminDashboardProps {
  stats: {
    totalCalculations: number;
    totalLeads: number;
    convertedLeads: number;
    hotLeads: number;
    coldLeads: number;
  };
  monthlyData: any[];
  leadStatus: any[];
  industryDist: any[];
  packagePopularity: any[];
  featureUsage: any[];
  conversionFunnel: any[];
}

export default function AdminDashboard({
  stats,
  monthlyData,
  leadStatus,
  industryDist,
  packagePopularity,
  featureUsage,
  conversionFunnel,
}: AdminDashboardProps) {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-[#3a4a5f]/40 text-[#adc6ff] rounded font-mono text-[10px] uppercase tracking-widest font-semibold border border-[#adc6ff]/15">
              Pricing Control
            </span>
            <div className="h-px w-12 bg-white/20"></div>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Dashboard Analytics
          </h1>
          <p className="font-body-lg text-slate-450 text-sm md:text-base leading-relaxed">
            Design, manage, and scale your service pricing tiers with surgical precision. All modifications reflect instantly across your global sales platforms.
          </p>
        </div>
      </header>

      {/* 1. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          label="Total Calculations"
          value={stats.totalCalculations}
          iconName="Calculator"
          description="Lifetime calculator runs"
        />
        <StatCard
          label="Total Inquiries"
          value={stats.totalLeads}
          iconName="MessageSquare"
          description="Contact forms submitted"
        />
        <StatCard
          label="Converted Leads"
          value={stats.convertedLeads}
          iconName="CheckSquare"
          description="Booked client projects"
        />
        <StatCard
          label="Hot Leads"
          value={stats.hotLeads}
          iconName="Flame"
          description="Actively nurtured leads"
        />
        <StatCard
          label="Cold Leads"
          value={stats.coldLeads}
          iconName="Snowflake"
          description="Uncontacted or new leads"
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
