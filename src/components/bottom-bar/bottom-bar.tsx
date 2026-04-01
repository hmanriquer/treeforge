import { useEffect, useRef, useState } from 'react';

import { Check, ChevronUp, GitBranch, Loader2, RefreshCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGitStore } from '@/stores/git.store';

// ─── Branch Selector Popover ─────────────────────────────────────────────────
function BranchSelector() {
  const branches = useGitStore((s) => s.branches);
  const currentBranch = useGitStore((s) => s.currentBranch);
  const isLoading = useGitStore((s) => s.isLoading);
  const checkout = useGitStore((s) => s.checkout);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [switching, setSwitching] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when dialog opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = branches.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase()),
  );

  const handleCheckout = async (branch: string) => {
    if (branch === currentBranch) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    setOpen(false);
    setQuery('');
    try {
      await checkout(branch);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isLoading || branches.length === 0}
        title="Switch branch"
        className={cn(
          'flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 transition-colors',
          'font-mono text-[10px] tracking-wider uppercase',
          'hover:bg-white/10 hover:text-zinc-200',
          open && 'bg-white/10 text-zinc-200',
          (isLoading || branches.length === 0) && 'cursor-default opacity-50',
        )}
      >
        {switching ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <GitBranch className="size-3" />
        )}
        <span className="max-w-[160px] truncate">
          {currentBranch ?? 'no branch'}
        </span>
        <ChevronUp
          className={cn(
            'size-3 shrink-0 transition-transform',
            !open && 'rotate-180',
          )}
        />
      </button>

      {/* Popover — opens upward */}
      {open && (
        <div
          className="absolute right-0 bottom-full mb-1 flex w-64 flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-xl"
          style={{ zIndex: 50 }}
        >
          {/* Search */}
          <div className="border-b border-zinc-700 px-2 py-1.5">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter branches…"
              className="w-full bg-transparent text-[12px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                  setQuery('');
                }
                if (e.key === 'Enter' && filtered.length === 1)
                  handleCheckout(filtered[0]);
              }}
            />
          </div>

          {/* Branch list */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-center text-[11px] text-zinc-500">
                No branches match "{query}"
              </p>
            ) : (
              filtered.map((branch) => {
                const isActive = branch === currentBranch;
                return (
                  <button
                    key={branch}
                    onClick={() => handleCheckout(branch)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors',
                      isActive
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100',
                    )}
                  >
                    <GitBranch
                      className={cn(
                        'size-3 shrink-0',
                        isActive ? 'text-[#89b4fa]' : 'text-zinc-500',
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate font-mono">
                      {branch}
                    </span>
                    {isActive && (
                      <Check className="size-3 shrink-0 text-[#a6e3a1]" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-zinc-700 px-3 py-1.5 text-[10px] text-zinc-600">
            {branches.length} branch{branches.length !== 1 ? 'es' : ''}
            {query &&
              ` · ${filtered.length} match${filtered.length !== 1 ? 'es' : ''}`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Bottom Bar ──────────────────────────────────────────────────────────
export function BottomBar() {
  const savedRepos = useGitStore((s) => s.savedRepos);
  const fetchBranches = useGitStore((s) => s.fetchBranches);
  const fetchStatus = useGitStore((s) => s.fetchStatus);
  const isLoading = useGitStore((s) => s.isLoading);

  const handleRefresh = async () => {
    await fetchBranches();
    await fetchStatus();
  };

  return (
    <div className="border-border bg-surface-lowest text-muted-foreground flex h-7 items-center justify-between border-t px-4 font-mono text-[10px] tracking-wider uppercase select-none">
      <div className="flex items-center gap-6">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>System Online</span>
        </div>

        {/* Repo count */}
        <span>
          {savedRepos.length} Repositorie{savedRepos.length !== 1 ? 's' : ''}{' '}
          Found
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Encoding */}
        <span>UTF-8</span>

        {/* Branch selector — replaces the static text */}
        <BranchSelector />

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          title="Refresh branches &amp; status"
          className="hover:bg-surface-highest hover:text-foreground focus-visible:ring-ring flex h-5 w-5 items-center justify-center rounded-sm transition-colors focus:outline-none focus-visible:ring-1 disabled:opacity-50"
        >
          <RefreshCcw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
          <span className="sr-only">Refresh status</span>
        </button>
      </div>
    </div>
  );
}
