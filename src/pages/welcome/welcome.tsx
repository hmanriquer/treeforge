import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { open } from '@tauri-apps/plugin-dialog';

import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Toolbar } from '@/components/toolbar';
import { useGitStore } from '@/stores/git.store';
import { RepoCard } from '@/components/repo-card';

export function WelcomePage() {
  const navigate = useNavigate();
  const addRepo = useGitStore((s) => s.addRepo);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenFolder = async () => {
    try {
      setIsOpening(true);
      const directoryPath = await open({
        directory: true,
        multiple: false,
        title: 'Select a Local Git Repository',
      });

      if (directoryPath) {
        addRepo(directoryPath);
        navigate('/dashboard', { replace: true });
      }
    } catch (e) {
      console.error('Failed to open dialog', e);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <main className="bg-background relative flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Toolbar />
        <div className="mx-auto w-full max-w-7xl flex-1 overflow-auto p-6 space-y-4">
          <Header
            cloneRepository={() => console.warn('Not implemented yet')}
            createRepository={() => console.warn('Not implemented yet')}
            addLocalRepository={handleOpenFolder}
          />
          <ul data-testid="repo-list" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <RepoCard
                key={index}
                name={`Repository ${index + 1}`}
                path={`/path/to/repo-${index + 1}`}
                branchName={`main`}
                status="synced"
              />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
