import * as React from 'react';

import { computeGraph } from '@/helpers/git-graph.helpers';
import { cn } from '@/lib/utils';
import { useGitStore } from '@/stores/git.store';

import { MOCHA } from '../git-graph-row/constants';
import { GitGraphRow } from '../git-graph-row/git-graph-row';

// ─── Header bar ───────────────────────────────────────────────────────────────
function GraphHeader({ total }: { total: number }) {
  return (
    <div
      className="flex h-9 w-full shrink-0 items-center justify-between border-b px-4 text-[11px] font-semibold tracking-wider uppercase"
      style={{
        background: MOCHA.mantle,
        borderColor: MOCHA.crust,
        color: MOCHA.subtext1,
      }}
    >
      <span>Graph</span>
      <span
        style={{ color: MOCHA.overlay0 }}
        className="font-normal tracking-normal normal-case"
      >
        {total.toLocaleString()} commit{total !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

// ─── Loading + empty states ───────────────────────────────────────────────────
function LoadingState() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3"
      style={{ background: MOCHA.base, color: MOCHA.subtext0 }}
    >
      <div
        className="h-6 w-6 animate-spin rounded-full border-2"
        style={{
          borderColor: MOCHA.surface1,
          borderTopColor: MOCHA.accents[0],
        }}
      />
      <span className="text-sm">Loading commit history…</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3"
      style={{ background: MOCHA.base, color: MOCHA.subtext0 }}
    >
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke={MOCHA.surface2}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="19" r="2" />
        <line x1="12" y1="7" x2="12" y2="17" />
      </svg>
      <p className="text-sm">No commits found in this repository.</p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function GitGraph() {
  const { commits, isLoading } = useGitStore();
  const [selectedHash, setSelectedHash] = React.useState<string | null>(null);

  const graphData = React.useMemo(() => {
    if (!commits.length) return null;
    return computeGraph(commits);
  }, [commits]);

  if (isLoading) return <LoadingState />;
  if (!graphData || graphData.nodes.length === 0) return <EmptyState />;

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-lg border',
      )}
      style={{ background: MOCHA.base, borderColor: MOCHA.crust }}
    >
      <GraphHeader total={graphData.nodes.length} />

      {/* Scrollable graph body */}
      <div
        className="min-w-0 flex-1 overflow-auto"
        style={{ background: MOCHA.base }}
      >
        <div style={{ minWidth: 600 }}>
          {graphData.nodes.map((node) => (
            <GitGraphRow
              key={node.commit.hash}
              node={node}
              colorMap={graphData.colorMap}
              isSelected={selectedHash === node.commit.hash}
              onClick={() =>
                setSelectedHash((prev) =>
                  prev === node.commit.hash ? null : node.commit.hash,
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
