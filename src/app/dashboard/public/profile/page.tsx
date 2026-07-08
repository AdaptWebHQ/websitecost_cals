import { getServerUser } from '@/actions/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function PublicProfilePage() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
        Please sign in to view your profile details.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Your Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review your access settings and personal details.
        </p>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800/60">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {user.name}
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-transparent capitalize ml-1 text-xs">
                {user.role}
              </Badge>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Display Name</Label>
            <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl h-11 px-3.5 text-white gap-3 select-none">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-200">{user.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Email Address</Label>
            <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl h-11 px-3.5 text-white gap-3 select-none">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{user.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Security Role Assignment</Label>
            <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl h-11 px-3.5 text-white gap-3 select-none">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300 capitalize">{user.role} Access Privilege</span>
            </div>
          </div>

          {user.createdAt && (
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Registered Since</Label>
              <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl h-11 px-3.5 text-white gap-3 select-none">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">{formatDate(new Date(user.createdAt))}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
