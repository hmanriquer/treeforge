import { useNavigate } from 'react-router-dom';

import { FolderGit2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGitStore } from '@/stores/git.store';

export function DashboardPage() {
  const currentRepo = useGitStore((s) => s.repoPath);
  const removeRepo = useGitStore((s) => s.removeRepo);
  const navigate = useNavigate();

  const handleForget = () => {
    if (currentRepo) {
      removeRepo(currentRepo);
      // Let the ProtectedRoute auto-redirect if array becomes empty
      navigate('/');
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 flex h-screen flex-col items-center justify-center space-y-6 bg-zinc-950 text-white duration-500 ease-out">
      <div className="rounded-full bg-zinc-900 p-4 ring-1 ring-white/10">
        <FolderGit2 className="h-8 w-8 text-zinc-400" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Active Repository</h2>
        <p className="rounded-md bg-zinc-900 px-3 py-1.5 font-mono text-sm text-zinc-400 ring-1 ring-white/10">
          {currentRepo}
        </p>
      </div>

      <Button variant="destructive" onClick={handleForget}>
        Forget Repository
      </Button>
    </div>
  );
}
