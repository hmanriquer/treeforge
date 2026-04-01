import { GitCommit } from '@/stores/git.store';

export interface GraphNode {
  commit: GitCommit;
  column: number;
  colorIndex: number;
  // Routes coming in from the previous row
  incomingBranches: (string | null)[];
  // Routes going out to the next row
  outgoingBranches: (string | null)[];
}

export function computeGraph(commits: GitCommit[]): {
  nodes: GraphNode[];
  colorMap: Map<string, number>;
} {
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
