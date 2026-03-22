import { useState } from "react";
import { GitCompare, ArrowRight, ArrowLeftRight } from "lucide-react";
import { FileIcon } from "./ui/file-icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const STATUS_DIFF = {
  added: "bg-emerald-500",
  modified: "bg-amber-500",
  deleted: "bg-red-500",
} as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: any[];
  diffFiles: any[];
};

export function BranchCompareDialog({
  open,
  onOpenChange,
  branches,
  diffFiles,
}: Props) {
  const localBranches = branches.filter((b) => !b.isRemote);

  const [base, setBase] = useState(localBranches[0]?.name || "");
  const [compare, setCompare] = useState(localBranches[1]?.name || "");
  const [diff, setDiff] = useState<any>(null);

  const swap = () => {
    setBase(compare);
    setCompare(base);
  };

  const totalAdd = diffFiles.reduce((s, f) => s + f.additions, 0);
  const totalDel = diffFiles.reduce((s, f) => s + f.deletions, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-surface-0 border-border p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-sm font-medium">
            <GitCompare className="h-4 w-4 text-muted-foreground" />
            Compare Branches
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select two branches to compare their differences
          </DialogDescription>
        </DialogHeader>

        {/* BRANCH SELECTORS */}
        <main className="px-5 pb-4"></main>
      </DialogContent>
    </Dialog>
  );
}
