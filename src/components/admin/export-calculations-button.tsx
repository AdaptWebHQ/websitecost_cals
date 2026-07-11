'use client';

import { useState } from 'react';
import { exportCalculationsCsvAction } from '@/actions/reports';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';

export default function ExportCalculationsButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await exportCalculationsCsvAction();
      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'website_calculations_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(response.error || 'Failed to export calculations.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to trigger calculations CSV export.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-4 gap-2 font-bold cursor-pointer disabled:opacity-50 text-xs shadow-md"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      Export Calculations (CSV)
    </Button>
  );
}
