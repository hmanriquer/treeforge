import { MOCHA } from '@/components/git-graph-row/constants';
import { GitCommit } from '@/stores/git.store';

export type GraphNode = {
  commit: GitCommit;
  column: number;
  colorIndex: number;
  // Routes coming in from the previous row
  incomingBranches: (string | null)[];
  // Routes going out to the next row
  outgoingBranches: (string | null)[];
};

type ParseRefOutput = {
  label: string;
  bg: string;
  fg: string;
  border: string;
};

export type ComputeGraphOutput = {
  nodes: GraphNode[];
  colorMap: Map<string, number>;
};

export function computeGraph(commits: GitCommit[]): ComputeGraphOutput {
  const branches: (string | null)[] = [];
  let nextColor = 0;
  const colors = new Map<string, number>();

  return {
    nodes: commits.map((commit) => {
      // 1. Where is this commit?
      let column = branches.indexOf(commit.hash);
      const isBranchTip = column === -1;

      // If we've never seen this commit, it's either the very first commit (HEAD)
      // or a branch that just appeared in the log.
      if (isBranchTip) {
        const emptyIdx = branches.indexOf(null);
        if (emptyIdx !== -1) {
          column = emptyIdx;
        } else {
          column = branches.length;
        }
        branches[column] = commit.hash;
      }

      if (!colors.has(commit.hash)) {
        colors.set(commit.hash, nextColor++);
      }
      const colorIndex = colors.get(commit.hash)!;

      // Snapshot the incoming tracks (for drawing lines entering this row from top)
      const incomingBranches = [...branches];
      // A newly discovered branch tip shouldn't have an incoming line from above
      if (isBranchTip) {
        incomingBranches[column] = null;
      }

      // 2. Process parents
      // The commit is consumed, so clear its column. We will reuse it for the primary parent if possible.
      branches[column] = null;

      if (commit.parents.length > 0) {
        const p0 = commit.parents[0];
        // If the primary parent isn't already tracked elsewhere, it neatly continues on this column
        if (branches.indexOf(p0) === -1) {
          branches[column] = p0;
          if (!colors.has(p0)) {
            colors.set(p0, colorIndex);
          }
        }

        // Additional parents (merge commit) branch out to other columns
        for (let i = 1; i < commit.parents.length; i++) {
          const p = commit.parents[i];
          if (branches.indexOf(p) === -1) {
            const emptyIdx = branches.indexOf(null);
            // Try to place the branch slot to the right
            if (emptyIdx !== -1 && emptyIdx > column) {
              branches[emptyIdx] = p;
            } else {
              branches.push(p);
            }
            if (!colors.has(p)) {
              colors.set(p, nextColor++);
            }
          }
        }
      }

      // Clean up trailing nulls to keep SVG width small
      while (branches.length > 0 && branches[branches.length - 1] === null) {
        branches.pop();
      }

      const outgoingBranches = [...branches];

      return {
        commit,
        column,
        colorIndex,
        incomingBranches,
        outgoingBranches,
      };
    }),
    colorMap: colors,
  };
}

export function parseRef(raw: string): ParseRefOutput {
  const r = raw.trim().replace(/[()]/g, '');

  if (r === 'HEAD') {
    return { label: 'HEAD', bg: '#45475a', fg: '#cba6f7', border: '#cba6f7' };
  }
  if (r.startsWith('HEAD -> ')) {
    const branch = r.replace('HEAD -> ', '');
    return { label: branch, bg: '#1e1e2e', fg: '#89b4fa', border: '#89b4fa' };
  }
  if (r.startsWith('tag: ')) {
    const tag = r.replace('tag: ', '');
    return {
      label: `🏷 ${tag}`,
      bg: '#1e1e2e',
      fg: '#f9e2af',
      border: '#f9e2af',
    };
  }
  if (r.startsWith('origin/')) {
    return { label: r, bg: '#1e1e2e', fg: '#a6e3a1', border: '#a6e3a1' };
  }
  // Local branch
  return { label: r, bg: '#313244', fg: '#b4befe', border: '#585b70' };
}

export function getColor(index: number): string {
  return MOCHA.accents[index % MOCHA.accents.length];
}
