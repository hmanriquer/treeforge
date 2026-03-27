import { useNavigate } from "react-router-dom";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderGit2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGitStore } from "../stores/git.store";
import { useState } from "react";

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
        title: "Select a Local Git Repository",
      });

      if (directoryPath) {
        addRepo(directoryPath);
        navigate("/dashboard", { replace: true });
      }
    } catch (e) {
      console.error("Failed to open dialog", e);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center max-w-lg text-center p-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        <div className="p-4 bg-blue-500/20 rounded-2xl ring-1 ring-blue-500/30 mb-2">
          <FolderGit2 className="w-12 h-12 text-blue-400" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome to TreeForge
        </h1>

        <p className="text-zinc-400 text-lg">
          Connect your first local repository to begin managing branches,
          commits, and workflows in a stunning environment.
        </p>

        <div className="pt-6 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full text-base font-medium h-14 bg-white text-black hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            onClick={handleOpenFolder}
            disabled={isOpening}
          >
            {isOpening ? "Opening Dialog..." : "Select Repository"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
