import { RefreshCcw } from 'lucide-react';

import { useGitStore } from '@/stores/git.store';

export function BottomBar() {
  const savedRepos = useGitStore((s) => s.savedRepos);
  const currentBranch = useGitStore((s) => s.currentBranch);

  return (
    <div className="border-border bg-surface-lowest text-muted-foreground flex h-7 items-center justify-between border-t px-4 font-mono text-[10px] tracking-wider uppercase select-none">
      <div className="flex items-center gap-6">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>System Online</span>
        </div>

        {/* Repo Count */}
        <span>
          {savedRepos.length} Repositorie{savedRepos.length !== 1 ? 's' : ''}{' '}
          Found
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Encoding */}
        <span>UTF-8</span>

        {/* Branch Info */}
        <span>Branch: {currentBranch}</span>

        {/* Sync Button */}
        <button className="hover:bg-surface-highest hover:text-foreground focus-visible:ring-ring flex h-5 w-5 items-center justify-center rounded-sm transition-colors focus:outline-none focus-visible:ring-1">
          <RefreshCcw className="h-3 w-3" />
          <span className="sr-only">Refresh status</span>
        </button>
      </div>
    </div>
  );
}
