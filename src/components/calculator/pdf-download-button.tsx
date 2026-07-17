'use client';

import { useState } from 'react';
import { getCalculationPdfAction } from '@/actions/calculations/pdf';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

interface PdfDownloadButtonProps {
  calculationId: string;
  businessName?: string;
  onDownloaded?: () => void;
}

export default function PdfDownloadButton({ calculationId, businessName, onDownloaded }: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await getCalculationPdfAction(calculationId);
      if (response.success && response.data) {
        // Open PDF base64 dynamic frame or download directly
        const base64Data = response.data;
        
        // Trigger browser native download link
        const link = document.createElement('a');
        link.href = base64Data;
        
        // Sanitize business name for safe file system names
        const nameSlug = businessName
          ? businessName.trim().replace(/[^a-zA-Z0-9\s-]/g, '').replace(/[\s-]+/g, '_')
          : calculationId;
          
        link.download = `Project_Quotation_${nameSlug}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Notify parent that download succeeded so it can auto-reset
        onDownloaded?.();
      } else {
        setErrorMsg(response.error || 'Failed to download quotation.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Error generating document PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/10 disabled:opacity-50 flex items-center justify-center cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Download PDF Quotation
          </>
        )}
      </Button>
      {errorMsg && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 select-none">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
