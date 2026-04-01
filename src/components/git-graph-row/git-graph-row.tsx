import { memo } from 'react';

import { getColor, parseRef } from '@/helpers/git-graph.helpers';

import { DOT_R, MOCHA, ROW_HEIGHT, TRACK_WIDTH } from './constants';
import type { GitGraphRowProps } from './types';

export const GitGraphRow = memo(function GitGraphRow({
  node,
  colorMap,
  isSelected,
  onClick,
}: GitGraphRowProps) {
  const { commit, column, colorIndex, incomingBranches, outgoingBranches } =
    node;

  const maxTracks = Math.max(
    incomingBranches.length,
    outgoingBranches.length,
    column + 1,
  );
  const svgWidth = maxTracks * TRACK_WIDTH + 12;
  const dotX = column * TRACK_WIDTH + TRACK_WIDTH / 2;
  const dotY = ROW_HEIGHT / 2;
  const curve = ROW_HEIGHT * 0.45;

  const refs = commit.refs
    ? commit.refs
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
        .map(parseRef)
    : [];

  const rowBg = isSelected ? MOCHA.surface0 : 'transparent';
  const rowBorderColor = MOCHA.surface0;

  return (
    <div
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center border-b transition-colors"
      style={{
        height: ROW_HEIGHT,
        minHeight: ROW_HEIGHT,
        background: rowBg,
        borderColor: rowBorderColor,
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLDivElement).style.background =
            MOCHA.surface0 + '60';
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      {/* SVG graph lanes */}
      <div className="ml-3 flex h-full shrink-0 items-center">
        <svg width={svgWidth} height={ROW_HEIGHT} className="overflow-visible">
          {/* Pass-through lines */}
          {incomingBranches.map((incHash, incCol) => {
            if (!incHash || incHash === commit.hash) return null;
            const outCol = outgoingBranches.indexOf(incHash);
            if (outCol === -1) return null;
            const x0 = incCol * TRACK_WIDTH + TRACK_WIDTH / 2;
            const x1 = outCol * TRACK_WIDTH + TRACK_WIDTH / 2;
            const d =
              x0 === x1
                ? `M ${x0} 0 L ${x1} ${ROW_HEIGHT}`
                : `M ${x0} 0 C ${x0} ${curve}, ${x1} ${curve}, ${x1} ${ROW_HEIGHT}`;
            return (
              <path
                key={`pass-${incCol}`}
                d={d}
                fill="none"
                stroke={getColor(colorMap.get(incHash) ?? 0)}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            );
          })}

          {/* Lines merging into commit */}
          {incomingBranches.map((incHash, incCol) => {
            if (incHash !== commit.hash) return null;
            const x0 = incCol * TRACK_WIDTH + TRACK_WIDTH / 2;
            const d =
              x0 === dotX
                ? `M ${x0} 0 L ${dotX} ${dotY}`
                : `M ${x0} 0 C ${x0} ${dotY / 2}, ${dotX} ${dotY / 2}, ${dotX} ${dotY}`;
            return (
              <path
                key={`merge-${incCol}`}
                d={d}
                fill="none"
                stroke={getColor(colorIndex)}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            );
          })}

          {/* Lines going down to parents */}
          {commit.parents.map((parentHash) => {
            const outCol = outgoingBranches.indexOf(parentHash);
            if (outCol === -1) return null;
            const x1 = outCol * TRACK_WIDTH + TRACK_WIDTH / 2;
            const d =
              dotX === x1
                ? `M ${dotX} ${dotY} L ${x1} ${ROW_HEIGHT}`
                : `M ${dotX} ${dotY} C ${dotX} ${dotY + curve / 2}, ${x1} ${dotY + curve / 2}, ${x1} ${ROW_HEIGHT}`;
            return (
              <path
                key={`parent-${parentHash}`}
                d={d}
                fill="none"
                stroke={getColor(colorMap.get(parentHash) ?? colorIndex)}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            );
          })}

          {/* Commit dot with glow ring when selected */}
          {isSelected && (
            <circle
              cx={dotX}
              cy={dotY}
              r={DOT_R + 3}
              fill="none"
              stroke={getColor(colorIndex)}
              strokeWidth={1}
              opacity={0.35}
            />
          )}
          <circle
            cx={dotX}
            cy={dotY}
            r={DOT_R}
            fill={getColor(colorIndex)}
            stroke={MOCHA.base}
            strokeWidth={2.5}
          />
          {/* Inner specular highlight */}
          <circle
            cx={dotX}
            cy={dotY}
            r={DOT_R - 2.2}
            fill="rgba(255,255,255,0.25)"
          />
        </svg>
      </div>

      {/* Commit metadata */}
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden pr-4 pl-2">
        {/* Short hash */}
        <span
          className="w-[52px] shrink-0 font-mono text-[10px] leading-none tabular-nums"
          style={{ color: MOCHA.overlay1 }}
        >
          {commit.hash}
        </span>

        {/* Refs + subject */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {refs.map((ref, i) => (
            <span
              key={i}
              className="shrink-0 rounded px-1.5 py-[2px] font-mono text-[10px] leading-none font-semibold"
              style={{
                background: ref.bg,
                color: ref.fg,
                border: `1px solid ${ref.border}`,
                boxShadow: `0 0 6px ${ref.border}30`,
              }}
            >
              {ref.label}
            </span>
          ))}
          <span
            className="truncate text-[13px]"
            style={{ color: MOCHA.text }}
            title={commit.subject}
          >
            {commit.subject}
          </span>
        </div>

        {/* Author + date */}
        <div
          className="ml-auto flex shrink-0 items-center gap-4 text-[11px]"
          style={{ color: MOCHA.subtext0 }}
        >
          <span
            className="w-24 truncate text-right"
            style={{
              borderRight: `1px solid ${MOCHA.surface1}`,
              paddingRight: 12,
            }}
          >
            {commit.author}
          </span>
          <span
            className="w-20 text-right font-mono text-[10px]"
            style={{ color: MOCHA.overlay1 }}
          >
            {commit.date}
          </span>
        </div>
      </div>
    </div>
  );
});
