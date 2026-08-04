'use client';

import { useState, useEffect } from 'react';
import { getCalculationPdfAction } from '@/actions/calculations/pdf';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

const CATCHY_PHRASES = [
  "Crafting high-performance digital experiences...",
  "Transforming your bold ideas into clean, interactive code...",
  "Designing pixel-perfect interfaces that inspire and engage...",
  "Building ultra-fast, modern, and SEO-friendly websites...",
  "Bringing your business online with premium responsive layouts...",
  "Optimizing performance, speed, and overall user experience...",
  "Developing cutting-edge, secure, and scalable web solutions...",
  "Empowering your brand through state-of-the-art web design..."
];

interface PdfDownloadButtonProps {
  calculationId: string;
  businessName?: string;
  onDownloaded?: () => void;
}

export default function PdfDownloadButton({ calculationId, businessName, onDownloaded }: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [catchyPhrase, setCatchyPhrase] = useState('');

  useEffect(() => {
    if (isLoading) {
      const randomIndex = Math.floor(Math.random() * CATCHY_PHRASES.length);
      setCatchyPhrase(CATCHY_PHRASES[randomIndex]);
    }
  }, [isLoading]);

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
        <FileText className="w-4 h-4" />
        Download PDF Quotation
      </Button>
      
      {errorMsg && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 select-none">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMsg}
        </p>
      )}

      {/* Branded loading overlay during PDF generation */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/95 text-slate-600 font-sans backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
            <img
              src="/uploaded_logo.png"
              alt="AdaptWeb Logo"
              className="w-20 h-20 object-contain animate-pulse mb-1"
            />
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-wider">AdaptWeb</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full animate-pulse my-1" />
            <p className="text-sm font-medium tracking-wide text-slate-600 italic animate-in fade-in duration-500">
              {catchyPhrase}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating PDF Quotation...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
