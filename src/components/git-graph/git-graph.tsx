import * as React from 'react';
import { useGitStore } from '@/stores/git.store';
import { GraphNode, computeGraph } from './algorithm';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const TRACK_WIDTH = 20;
const ROW_HEIGHT = 48;

// Modern vibrant color palette for branches
const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#84cc16', // lime-500
];

function getColor(index: number) {
  return COLORS[index % COLORS.length];
}

const GitGraphRow = ({
  node,
  colorMap
}: {
  node: GraphNode;
  colorMap: Map<string, number>;
}) => {
  const { commit, column, colorIndex, incomingBranches, outgoingBranches } = node;

  // Track max tracks to determine SVG width and container padding
  const maxTracks = Math.max(incomingBranches.length, outgoingBranches.length, column + 1);
  const svgWidth = maxTracks * TRACK_WIDTH;
  
  const dotX = column * TRACK_WIDTH + (TRACK_WIDTH / 2);
  const dotY = ROW_HEIGHT / 2;

  // Use a slight curve for smoother paths
  const curveFactor = ROW_HEIGHT / 2;

  return (
    <div className="flex w-full items-center border-b border-border/40 hover:bg-surface-high/50 transition-colors h-12 relative">
      {/* SVG Canvas for lines */}
      <div className="h-full shrink-0 flex ml-2">
        <svg
          className="h-full"
          width={svgWidth + 16}
          height={ROW_HEIGHT}
        >
          {/* 1. Draw Pass-through lines (top to bottom) */}
          {incomingBranches.map((incHash, incCol) => {
            if (!incHash) return null;
            if (incHash === commit.hash) return null; // This track terminates at the dot

            // Find where this track goes
            const outCol = outgoingBranches.indexOf(incHash);
            if (outCol === -1) return null;

            const x0 = incCol * TRACK_WIDTH + (TRACK_WIDTH / 2);
            const x1 = outCol * TRACK_WIDTH + (TRACK_WIDTH / 2);
            
            // Draw a bezier curve connecting them
            const path = x0 === x1 
              ? `M ${x0} 0 L ${x1} ${ROW_HEIGHT}`
              : `M ${x0} 0 C ${x0} ${curveFactor}, ${x1} ${curveFactor}, ${x1} ${ROW_HEIGHT}`;

            return (
              <path 
                key={`pass-${incCol}`}
                d={path}
                fill="none"
                stroke={getColor(colorMap.get(incHash) || 0)}
                strokeWidth={2}
              />
            );
          })}

          {/* 2. Draw lines originating from top merging into the commit dot */}
          {incomingBranches.map((incHash, incCol) => {
            if (incHash !== commit.hash) return null;

            const x0 = incCol * TRACK_WIDTH + (TRACK_WIDTH / 2);
            
            // Top to dot
            const path = x0 === dotX
              ? `M ${x0} 0 L ${dotX} ${dotY}`
              : `M ${x0} 0 C ${x0} ${dotY/2}, ${dotX} ${dotY/2}, ${dotX} ${dotY}`;

            return (
              <path 
                key={`merge-${incCol}`}
                d={path}
                fill="none"
                stroke={getColor(colorIndex)}
                strokeWidth={2}
              />
            );
          })}

          {/* 3. Draw lines coming out of the dot going to parents */}
          {commit.parents.map((parentHash) => {
             const outCol = outgoingBranches.indexOf(parentHash);
             if (outCol === -1) return null;

             const x1 = outCol * TRACK_WIDTH + (TRACK_WIDTH / 2);
             
             // Draw bezier
             const path = dotX === x1
              ? `M ${dotX} ${dotY} L ${x1} ${ROW_HEIGHT}`
              : `M ${dotX} ${dotY} C ${dotX} ${dotY + ROW_HEIGHT/4}, ${x1} ${dotY + ROW_HEIGHT/4}, ${x1} ${ROW_HEIGHT}`;

             return (
               <path 
                key={`parent-${parentHash}-${outCol}`}
                d={path}
                fill="none"
                stroke={getColor(colorMap.get(parentHash) || colorIndex)}
                strokeWidth={2}
               />
             )
          })}

          {/* 4. Draw the dot */}
          <circle
            cx={dotX}
            cy={dotY}
            r={5}
            fill={getColor(colorIndex)}
            stroke="hsl(var(--background))"
            strokeWidth={3}
          />
        </svg>
      </div>

      {/* Row metadata Details */}
      <div className="flex-1 min-w-0 pr-4 flex items-center gap-3 overflow-hidden ml-2">
         {/* Hash */}
         <span className="font-mono text-xs text-muted-foreground w-16 shrink-0">{commit.hash}</span>
         {/* Message and Refs */}
         <div className="flex items-center gap-2 truncate text-sm text-foreground">
           {commit.refs && (
             <div className="flex items-center gap-1 shrink-0">
               {commit.refs.split(',').map((r) => {
                 let variant: 'default' | 'outline' | 'secondary' = 'outline';
                 if (r.includes('HEAD')) variant = 'default';
                 else if (r.includes('origin/')) variant = 'secondary';
                 
                 return (
                   <Badge key={r} variant={variant} className="text-[10px] h-4 px-1.5 leading-none rounded-sm font-normal">
                     {r.trim()}
                   </Badge>
                 );
               })}
             </div>
           )}
           <span className="truncate" title={commit.subject}>{commit.subject}</span>
         </div>
         {/* Author / Date */}
         <div className="ml-auto flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
            <span className="w-24 truncate text-right border-r border-border/50 pr-4">{commit.author}</span>
            <span className="w-24 text-right font-mono text-[10px]">{commit.date}</span>
         </div>
      </div>
    </div>
  );
};

export function GitGraph() {
  const { commits, isLoading } = useGitStore();

  const graphData = React.useMemo(() => {
    if (!commits.length) return null;
    return computeGraph(commits);
  }, [commits]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-muted-foreground bg-surface-lowest">
        <div className="flex flex-col items-center gap-2 text-sm animate-pulse">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Loading branch visualization...
        </div>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex w-full h-full items-center justify-center text-muted-foreground text-sm bg-surface-lowest">
        No commits found.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-surface-lowest rounded-md border border-border overflow-hidden">
      <ScrollArea className="flex-1 w-full relative">
        <div className="min-w-[600px] w-full pb-4">
          {graphData.nodes.map((node) => (
            <GitGraphRow 
              key={node.commit.hash} 
              node={node} 
              colorMap={graphData.colorMap} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
