import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { FolderGit2 } from 'lucide-react';

import { Header } from '@/components/header';
import { RepoCard } from '@/components/repo-card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useGitStore } from '@/stores/git.store';

export function WelcomePage() {
  const navigate = useNavigate();
  const addRepo = useGitStore((s) => s.addRepo);
  const repos = useGitStore((s) => s.savedRepos);
  const selectRepo = useGitStore((s) => s.selectRepo);

  const [repoDetails, setRepoDetails] = useState<
    Record<
      string,
      { branchName: string; status: 'synced' | 'unsynced' | 'conflict' }
    >
  >({});

  useEffect(() => {
    async function loadDetails() {
      for (const repo of repos) {
        try {
          const branchesRaw = await invoke<string>('get_branches', {
            repoPath: repo,
          });
          const branchName =
            branchesRaw
              .split('\n')
              .find((b) => b.startsWith('*'))
              ?.replace('*', '')
              .trim() || 'main';

          const statusRaw = await invoke<string>('get_status', {
            repoPath: repo,
          });
          const status = statusRaw.trim() ? 'unsynced' : 'synced'; // Using unsynced if there are pending changes

          setRepoDetails((prev) => ({
            ...prev,
            [repo]: { branchName, status },
          }));
        } catch (e) {
          console.error(`Failed to load details for ${repo}`, e);
          setRepoDetails((prev) => ({
            ...prev,
            [repo]: { branchName: 'unknown', status: 'conflict' },
          }));
        }
      }
    }

    if (repos.length > 0) {
      loadDetails();
    }
  }, [repos]);

  const handleOpenFolder = async () => {
    try {
      const directoryPath = await open({
        directory: true,
        multiple: false,
        title: 'Select a Local Git Repository',
      });

      if (directoryPath) {
        addRepo(directoryPath);
      }
    } catch (e) {
      console.error('Failed to open dialog', e);
    }
  };

  const handleSelectRepo = (path: string) => {
    selectRepo(path);
    navigate('/dashboard');
  };

  return (
    <main className="bg-background relative flex h-full w-full flex-col justify-center overflow-auto p-10 animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-5xl space-y-12 pb-20">
        <Header
          cloneRepository={() => console.warn('Not implemented yet')}
          createRepository={() => console.warn('Not implemented yet')}
          addLocalRepository={handleOpenFolder}
        />

        {repos.length === 0 ? (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-700">
            <Empty className="mx-auto max-w-2xl border-dashed py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="mb-4">
                  <FolderGit2 className="text-muted-foreground h-12 w-12" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">No repositories found</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription className="text-base">
                  You haven't added any local Git repositories yet. Click "Add
                  Local Repo" above to get started with TreeForge.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="rounded-xl border bg-card/50 p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-700">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold tracking-tight">
              <FolderGit2 className="h-6 w-6 text-muted-foreground" />
              Recent Repositories
            </h2>
            <ul
              data-testid="repo-list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {repos.map((repoPath) => {
                const name = repoPath.split(/[\\/]/).pop() || repoPath;
                const details = repoDetails[repoPath];

                return (
                  <li
                    key={repoPath}
                    onClick={() => handleSelectRepo(repoPath)}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    <RepoCard
                      name={name}
                      path={repoPath}
                      branchName={details?.branchName || 'loading...'}
                      status={details?.status || 'synced'}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
