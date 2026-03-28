import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { open } from '@tauri-apps/plugin-dialog';
import { ArrowRight, FolderGit2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGitStore } from '@/stores/git.store';

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
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Background Decor */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <main className="animate-in fade-in slide-in-from-bottom-6 z-10 flex max-w-lg flex-col items-center space-y-6 p-8 text-center duration-1000 ease-out">
        <div className="mb-2 rounded-2xl bg-blue-500/20 p-4 ring-1 ring-blue-500/30">
          <FolderGit2 className="h-12 w-12 text-blue-400" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome to TreeForge
        </h1>

        <p className="text-lg text-zinc-400">
          Connect your first local repository to begin managing branches,
          commits, and workflows in a stunning environment.
        </p>

        <div className="w-full max-w-xs pt-6">
          <Button
            size="lg"
            className="h-14 w-full bg-white text-base font-medium text-black shadow-lg transition-all hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl"
            onClick={handleOpenFolder}
            disabled={isOpening}
          >
            {isOpening ? 'Opening Dialog...' : 'Select Repository'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
