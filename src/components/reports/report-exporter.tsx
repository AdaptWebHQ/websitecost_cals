'use client';

import { useState } from 'react';
import { exportCalculationsCsvAction, exportInquiriesCsvAction } from '@/actions/reports';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileSpreadsheet, BarChart2, Loader2, AlertCircle } from 'lucide-react';

export default function ReportExporter() {
  const [calcLoading, setCalcLoading] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerDownload = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCalculations = async () => {
    setCalcLoading(true);
    setErrorMessage(null);
    try {
      const response = await exportCalculationsCsvAction();
      if (response.success && response.data) {
        triggerDownload(response.data, 'website_calculations_report.csv');
      } else {
        setErrorMessage(response.error || 'Failed to download calculations.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to trigger calculations CSV compile.');
    } finally {
      setCalcLoading(false);
    }
  };

  const handleExportInquiries = async () => {
    setLeadLoading(true);
    setErrorMessage(null);
    try {
      const response = await exportInquiriesCsvAction();
      if (response.success && response.data) {
        triggerDownload(response.data, 'crm_leads_report.csv');
      } else {
        setErrorMessage(response.error || 'Failed to download inquiries.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to trigger inquiries CSV compile.');
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 max-w-4xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
              <div>
                <CardTitle className="text-white text-base font-bold">Calculation Submissions</CardTitle>
                <CardDescription className="text-slate-500 text-xs font-normal mt-0.5">Excel / CSV Spreadsheet format</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-slate-400 text-sm mt-2 leading-relaxed font-normal">
              Export every calculator run with raw user fields, selected features lists, individual price components, and totals.
            </CardContent>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleExportCalculations}
              disabled={calcLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-11 w-full gap-2 font-semibold disabled:opacity-50"
            >
              {calcLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Compiling CSV...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Export Calculations (CSV)
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3">
              <BarChart2 className="w-8 h-8 text-indigo-400" />
              <div>
                <CardTitle className="text-white text-base font-bold">Lead CRM Summary</CardTitle>
                <CardDescription className="text-slate-500 text-xs font-normal mt-0.5">Excel / CSV CRM Pipeline report</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-slate-400 text-sm mt-2 leading-relaxed font-normal">
              Download every expert consultation request, client budget range, status details, and inquiry note in a structured CSV report.
            </CardContent>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleExportInquiries}
              disabled={leadLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 w-full gap-2 font-semibold disabled:opacity-50"
            >
              {leadLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Compiling CSV...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Export CRM Report (CSV)
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
