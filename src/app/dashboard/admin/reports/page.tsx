import ReportExporter from '@/components/reports/report-exporter';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Exportable Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate and download spreadsheet reports summarizing calculator usage and lead metrics.
        </p>
      </div>

      <ReportExporter />
    </div>
  );
}
