import { useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { VscGitCommit } from 'react-icons/vsc';

import { useGitStore } from '@/stores/git.store';
import { SearchInput } from '../search-input';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { toolbarActions, type ToolbarActionId } from './actions';

// ─── Commit Dialog ────────────────────────────────────────────────────────────
function CommitDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [message, setMessage] = useState('');
  const commit = useGitStore((s) => s.commit);
  const isLoading = useGitStore((s) => s.isLoading);

  const handleCommit = async () => {
    if (!message.trim()) return;
    await commit(message.trim());
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-white/10 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Commit Changes</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter a commit message for the staged changes.
          </DialogDescription>
        </DialogHeader>
        <Input
          id="commit-message"
          placeholder="feat: my awesome change"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
          className="bg-zinc-800 border-white/10 text-zinc-100 placeholder:text-zinc-500"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCommit}
            disabled={!message.trim() || isLoading}
            className="bg-tech-blue hover:bg-tech-blue/90 text-black"
          >
            Commit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Branch Dialog ────────────────────────────────────────────────────────────
function BranchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState('');
  const createBranch = useGitStore((s) => s.createBranch);
  const isLoading = useGitStore((s) => s.isLoading);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createBranch(name.trim());
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-white/10 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Create Branch</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Creates a new branch from the current HEAD and checks it out.
          </DialogDescription>
        </DialogHeader>
        <Input
          id="branch-name"
          placeholder="feature/my-new-branch"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="bg-zinc-800 border-white/10 text-zinc-100 placeholder:text-zinc-500"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isLoading}
            className="bg-tech-blue hover:bg-tech-blue/90 text-black"
          >
            Create &amp; Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stash Dialog ─────────────────────────────────────────────────────────────
function StashDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [message, setMessage] = useState('');
  const gitStashSave = useGitStore((s) => s.gitStashSave);
  const gitStashPop = useGitStore((s) => s.gitStashPop);
  const stashList = useGitStore((s) => s.stashList);
  const isLoading = useGitStore((s) => s.isLoading);

  const handleSave = async () => {
    await gitStashSave(message.trim() || 'WIP');
    setMessage('');
    onOpenChange(false);
  };

  const handlePop = async () => {
    await gitStashPop();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-white/10 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Stash Changes</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Save your working-directory changes to the stash, or restore the
            latest stash.
          </DialogDescription>
        </DialogHeader>

        {stashList.length > 0 && (
          <div className="rounded-md bg-zinc-800/60 border border-white/5 p-3 text-xs text-zinc-400 font-mono space-y-1 max-h-32 overflow-y-auto">
            {stashList.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        )}

        <Input
          id="stash-message"
          placeholder="Optional stash message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-zinc-800 border-white/10 text-zinc-100 placeholder:text-zinc-500"
        />

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handlePop}
            disabled={stashList.length === 0 || isLoading}
            className="border-white/10"
          >
            Pop Stash
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-tech-blue hover:bg-tech-blue/90 text-black"
          >
            Save Stash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
export function Toolbar() {
  const [openDialog, setOpenDialog] = useState<ToolbarActionId | 'commit' | null>(null);
  const [busyAction, setBusyAction] = useState<ToolbarActionId | null>(null);
  const isLoading = useGitStore((s) => s.isLoading);
  const sync = useGitStore((s) => s.sync);
  const repoPath = useGitStore((s) => s.repoPath);
  const fetchStashList = useGitStore((s) => s.fetchStashList);

  const handleAction = async (action: (typeof toolbarActions)[number]) => {
    if (action.hasDialog) {
      if (action.id === 'stash') await fetchStashList();
      setOpenDialog(action.id);
      return;
    }
    setBusyAction(action.id);
    try {
      await action.action();
    } finally {
      setBusyAction(null);
    }
  };

  const handleSync = async () => {
    await sync();
  };

  return (
    <>
      <nav
        data-testid="main-toolbar"
        className="bg-background no-scrollbar flex h-14 w-full items-center justify-between gap-8 overflow-x-auto border-b border-neutral-900 px-4"
      >
        <section
          data-testid="toolbar-left"
          className="flex shrink-0 items-center gap-4 pr-2"
        >
          <SearchInput
            containerClassName="w-[320px]"
            placeholder="Search repositories or commits..."
            className="focus-visible:bg-card h-8 bg-black/20"
          />
          <div className="flex items-center gap-1 font-medium">
            {toolbarActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                disabled={!repoPath || busyAction === action.id || isLoading}
                onClick={() => handleAction(action)}
                className="text-muted-foreground hover:text-foreground h-8"
              >
                <action.icon className="mr-1 size-3" />
                {busyAction === action.id ? '…' : action.label}
              </Button>
            ))}
          </div>
        </section>
        <section
          data-testid="toolbar-right"
          className="flex shrink-0 items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!repoPath || isLoading}
              onClick={handleSync}
              className="h-8 font-medium"
            >
              <FaSync className={`mr-1 size-3 ${isLoading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button
              size="sm"
              disabled={!repoPath}
              onClick={() => setOpenDialog('commit')}
              className="bg-tech-blue hover:bg-tech-blue/90 h-8 font-medium text-black"
            >
              <VscGitCommit className="mr-1 size-3" />
              Commit
            </Button>
          </div>
        </section>
      </nav>

      {/* Dialogs */}
      <BranchDialog
        open={openDialog === 'branch'}
        onOpenChange={(v) => !v && setOpenDialog(null)}
      />
      <StashDialog
        open={openDialog === 'stash'}
        onOpenChange={(v) => !v && setOpenDialog(null)}
      />
      <CommitDialog
        open={openDialog === 'commit'}
        onOpenChange={(v) => !v && setOpenDialog(null)}
      />
    </>
  );
}
