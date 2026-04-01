import { open } from '@tauri-apps/plugin-dialog';
import { FolderGit2, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGitStore } from '@/stores/git.store';

function getRepoName(path: string) {
  return path.split(/[\\/]/).pop() || path;
}

export function RepoTabs() {
  const savedRepos = useGitStore((s) => s.savedRepos);
  const repoPath = useGitStore((s) => s.repoPath);
  const selectRepo = useGitStore((s) => s.selectRepo);
  const addRepo = useGitStore((s) => s.addRepo);
  const removeRepo = useGitStore((s) => s.removeRepo);

  const handleAddRepo = async () => {
    try {
      const directoryPath = await open({
        directory: true,
        multiple: false,
        title: 'Add another Git repository',
      });
      if (directoryPath) {
        addRepo(directoryPath);
        selectRepo(directoryPath);
      }
    } catch (e) {
      console.error('Failed to open dialog', e);
    }
  };

  const handleSelect = (path: string) => {
    if (path === repoPath) return;
    selectRepo(path);
  };

  const handleRemove = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    removeRepo(path);
  };

  if (savedRepos.length === 0) return null;

  return (
    <div className="flex h-9 w-full shrink-0 items-end border-b border-neutral-900 bg-zinc-950">
      {/*
        The inner div carries role="tablist".
        ARIA rules require that a tablist only contains role=tab children.
        The + button is intentionally placed as a sibling here (outside the tablist)
        so it doesn't violate that constraint.
      */}
      <div
        role="tablist"
        aria-label="Open repositories"
        className="no-scrollbar flex min-w-0 flex-1 items-end overflow-x-auto pl-1"
      >
        {savedRepos.map((path) => {
          const isActive = path === repoPath;
          const name = getRepoName(path);

          return (
            <button
              key={path}
              role="tab"
              data-selected={isActive}
              title={path}
              onClick={() => handleSelect(path)}
              className={cn(
                'group relative flex h-8 max-w-[180px] min-w-[100px] shrink-0 cursor-pointer items-center gap-2 rounded-t-md border border-b-0 px-3 text-xs font-medium transition-colors select-none',
                isActive
                  ? 'border-neutral-800 bg-zinc-900 text-zinc-100'
                  : 'border-transparent bg-transparent text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300',
              )}
            >
              {/* Active underline accent */}
              {isActive && (
                <span className="bg-tech-blue absolute right-3 bottom-0 left-3 h-[2px] rounded-full" />
              )}

              <FolderGit2 className="size-3 shrink-0" />

              <span className="truncate">{name}</span>

              {/* Close × (span so it doesn't nest buttons) */}
              <span
                onClick={(e) => handleRemove(e, path)}
                title={`Remove ${name}`}
                className={cn(
                  'ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-opacity',
                  isActive
                    ? 'opacity-40 hover:bg-white/10 hover:opacity-100'
                    : 'opacity-0 group-hover:opacity-40 group-hover:hover:opacity-100',
                )}
              >
                <X className="size-2.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* + button lives outside role="tablist" — ARIA-compliant sibling */}
      <button
        onClick={handleAddRepo}
        title="Add repository"
        aria-label="Add repository"
        className="mx-1 mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
