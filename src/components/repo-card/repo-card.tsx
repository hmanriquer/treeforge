import { AlertCircle, CheckCircle2, GitBranch, Network, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { RepoCardProps } from './types';

export function RepoCard({ name, path, branchName, status }: RepoCardProps) {
  const statusConfig = {
    synced: {
      badgeText: 'Synced',
      badgeClass:
        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
      footerIcon: CheckCircle2,
      footerText: 'Up to date',
      footerClass: 'text-emerald-500',
    },
    unsynced: {
      badgeText: 'Unsynced',
      badgeClass:
        'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20',
      footerIcon: RefreshCw,
      footerText: 'Pending changes',
      footerClass: 'text-amber-500',
    },
    conflict: {
      badgeText: 'Conflict',
      badgeClass:
        'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
      footerIcon: AlertCircle,
      footerText: 'Action required',
      footerClass: 'text-destructive',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.synced;
  const FooterIcon = currentStatus.footerIcon;

  return (
    <Card className="group flex w-full max-w-sm flex-col gap-4 border-border bg-card p-5 shadow-sm transition-all hover:bg-accent/30">
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/4 bg-[#24252a] text-[#86a8e7] shadow-inner transition-colors group-hover:bg-[#2b2d33]">
          <Network className="h-[22px] w-[22px]" />
        </div>
        <Badge
          variant="outline"
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-medium',
            currentStatus.badgeClass,
          )}
        >
          {currentStatus.badgeText}
        </Badge>
      </div>

      {/* Middle Content */}
      <div className="mt-1 flex flex-col gap-1.5">
        <h3 className="text-foreground text-[1.15rem] font-bold tracking-tight">
          {name}
        </h3>
        <p className="text-muted-foreground truncate font-mono text-[13px]">
          {path}
        </p>
      </div>

      {/* Separator inside Card */}
      <Separator className="my-1 opacity-70" />

      {/* Bottom Footer Row */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground flex w-full items-center gap-2.5 truncate transition-colors group-hover:text-foreground/80">
          <GitBranch className="h-[15px] w-[15px] shrink-0" />
          <span className="truncate font-mono text-[13px]">
            {branchName}
          </span>
        </div>
        <div
          className={cn(
            'flex shrink-0 items-center gap-1.5 text-[13px] font-medium',
            currentStatus.footerClass,
          )}
        >
          <FooterIcon className="h-4 w-4" />
          <span>{currentStatus.footerText}</span>
        </div>
      </div>
    </Card>
  );
}