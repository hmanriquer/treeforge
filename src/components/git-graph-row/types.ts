import type { GraphNode } from '@/helpers/git-graph.helpers';

export type GitGraphRowProps = {
  node: GraphNode;
  colorMap: Map<string, number>;
  isSelected: boolean;
  onClick: () => void;
};
