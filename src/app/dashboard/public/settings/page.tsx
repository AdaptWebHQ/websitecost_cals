import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Settings, Info } from 'lucide-react';
import { getServerUser } from '@/actions/auth';

export default async function PublicSettingsPage() {
  const user = await getServerUser();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your calculator preferences and profile configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
          <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3 border-b border-slate-850">
            <Settings className="w-6 h-6 text-indigo-400" />
            <div>
              <CardTitle className="text-white text-base font-bold">Preferences</CardTitle>
              <CardDescription className="text-slate-500 text-xs">Your local app configurations</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 text-slate-400 text-sm mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-500 text-xs">Authentication Provider</Label>
              <div className="text-slate-300 font-medium bg-slate-950/60 border border-slate-800 rounded-xl py-3 px-4 flex items-center justify-between">
                <span>Google OAuth 2.0</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-transparent">
                  Connected
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-500 text-xs">Security Role Status</Label>
              <div className="text-slate-300 font-medium bg-slate-950/60 border border-slate-800 rounded-xl py-3 px-4 flex items-center justify-between capitalize">
                <span>{user?.role || 'Public'} Session</span>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-transparent capitalize">
                  {user?.role || 'public'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 border-dashed border-slate-850">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-slate-200 text-sm font-semibold">Need Admin access?</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                If you are a administrator, change your role to `admin` in your Firebase Firestore console inside the `users` collection to unlock admin panels and CRM logs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
