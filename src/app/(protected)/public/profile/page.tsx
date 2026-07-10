import { getServerUser } from '@/actions/auth';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
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
    <div className="space-y-6 max-w-2xl animate-in fade-in-50 duration-300 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your access settings and personal details.
        </p>
      </div>

      <Card className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-2xl uppercase shadow-md shadow-primary/10">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              {user.name}
              <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-transparent capitalize ml-1 text-xs font-bold">
                {user.role}
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold">Display Name</Label>
            <div className="flex items-center bg-muted/20 border border-border rounded-xl h-12 px-3.5 text-foreground gap-3 select-none">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{user.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold">Email Address</Label>
            <div className="flex items-center bg-muted/20 border border-border rounded-xl h-12 px-3.5 text-foreground gap-3 select-none">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{user.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold">Security Role Assignment</Label>
            <div className="flex items-center bg-muted/20 border border-border rounded-xl h-12 px-3.5 text-foreground gap-3 select-none">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium capitalize">{user.role} Access Privilege</span>
            </div>
          </div>

          {user.createdAt && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold">Registered Since</Label>
              <div className="flex items-center bg-muted/20 border border-border rounded-xl h-12 px-3.5 text-foreground gap-3 select-none">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{formatDate(new Date(user.createdAt))}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
