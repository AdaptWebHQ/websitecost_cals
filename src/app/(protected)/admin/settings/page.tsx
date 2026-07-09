import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Sliders } from 'lucide-react';
import SeedButton from '@/components/settings/seed-button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">General Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure baseline platform constants, data imports, and security options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3">
              <Sliders className="w-8 h-8 text-indigo-400" />
              <div>
                <CardTitle className="text-white text-base font-bold">Calculator Constants</CardTitle>
                <CardDescription className="text-slate-500 text-xs">Configure markups and GST</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-slate-400 text-sm mt-2">
              Customize the default margins, pricing formulas, terms & conditions, and support details shown in quotations.
            </CardContent>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/admin/price-config">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl w-full">
                Edit Price Config
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <CardTitle className="text-white text-base font-bold">Admin Permissions</CardTitle>
                <CardDescription className="text-slate-500 text-xs">Manage system access roles</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-slate-400 text-sm mt-2">
              Configure which email IDs have Admin and Super Admin access inside Firestore user profiles.
            </CardContent>
          </div>
          <div className="mt-6">
            <Button disabled variant="outline" className="border-slate-800 text-slate-500 rounded-xl w-full">
              Manage Roles (Super Admin)
            </Button>
          </div>
        </Card>

        {/* Database Seeding Controls */}
        <SeedButton />
      </div>
    </div>
  );
}
