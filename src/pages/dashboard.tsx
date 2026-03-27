import { Button } from "../components/ui/button";
import { useGitStore } from "../stores/git.store";
import { FolderGit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const currentRepo = useGitStore((s) => s.repoPath);
  const removeRepo = useGitStore((s) => s.removeRepo);
  const navigate = useNavigate();

  const handleForget = () => {
    if (currentRepo) {
      removeRepo(currentRepo);
      // Let the ProtectedRoute auto-redirect if array becomes empty
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-white space-y-6 animate-in fade-in zoom-in-95 duration-500 ease-out">
      <div className="p-4 bg-zinc-900 rounded-full ring-1 ring-white/10">
        <FolderGit2 className="w-8 h-8 text-zinc-400" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Active Repository</h2>
        <p className="text-zinc-400 font-mono text-sm bg-zinc-900 py-1.5 px-3 rounded-md ring-1 ring-white/10">
          {currentRepo}
        </p>
      </div>

      <Button variant="destructive" onClick={handleForget}>
        Forget Repository
      </Button>
    </div>
  );
}
