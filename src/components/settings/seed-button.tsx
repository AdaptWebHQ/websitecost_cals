'use client';

import { useState } from 'react';
import { seedDatabaseAction } from '@/actions/seed';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Loader2, CheckCircle2 } from 'lucide-react';

export default function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsLoading(true);
    setMessage(null);
    setErrorMsg(null);
    try {
      const response = await seedDatabaseAction();
      if (response.success && response.data) {
        setMessage(response.data);
      } else {
        setErrorMsg(response.error || 'Failed to execute seeding.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error triggering database seed batch.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3">
          <Database className="w-8 h-8 text-indigo-400 animate-pulse" />
          <div>
            <CardTitle className="text-foreground text-base font-bold">Database Seed Tools</CardTitle>
            <CardDescription className="text-muted-foreground text-xs font-normal mt-0.5">Populate default master data</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 text-muted-foreground text-sm mt-2 leading-relaxed font-normal">
          Seeds packages, core feature categories, customizable modules, industry segments, and default pricing configurations in one batch.
        </CardContent>

        {message && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold select-none">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          onClick={handleSeed}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 w-full gap-2 font-semibold disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Seeding Collections...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              Seed Default Data
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
