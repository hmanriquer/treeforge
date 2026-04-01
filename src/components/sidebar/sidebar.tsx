import { open } from '@tauri-apps/plugin-dialog';
import { FileText, HelpCircle, Plus, Settings } from 'lucide-react';
import { LuGitBranch } from 'react-icons/lu';
import { PiGitBranch } from 'react-icons/pi';
import { VscGitStash } from 'react-icons/vsc';

import { cn } from '@/lib/utils';
import { useGitStore } from '@/stores/git.store';

import pkg from '../../../package.json';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const navItems = [
  { id: 'commit-log', label: 'Commit Log', icon: LuGitBranch, isActive: true },
  {
    id: 'stashes',
    label: 'Stashes',
    icon: VscGitStash,
    isActive: false,
  },
  { id: 'branches', label: 'Branches', icon: PiGitBranch, isActive: false },
  { id: 'changes', label: 'Changes', icon: Settings, isActive: false },
];

const footerItems = [
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'support', label: 'Support', icon: HelpCircle },
];

export function Sidebar() {
  const savedRepos = useGitStore((s) => s.savedRepos);
  const addRepo = useGitStore((s) => s.addRepo);
  const selectRepo = useGitStore((s) => s.selectRepo);

  const handleAddLocalRepo = async () => {
    try {
      const directoryPath = await open({
        directory: true,
        multiple: false,
        title: 'Select a Local Git Repository',
      });
      if (directoryPath) {
        addRepo(directoryPath);
        selectRepo(directoryPath);
      }
    } catch (e) {
      console.error('Failed to open dialog', e);
    }
  };

  const repoCount = savedRepos.length;

  return (
    <aside className="bg-sidebar flex h-full w-[260px] flex-col justify-between border-r border-neutral-900 py-6">
      <div className="flex flex-col gap-8 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 grid-cols-2 grid-rows-2 gap-[2px] rounded-md bg-blue-600 p-[10px] shadow-sm">
            <div className="rounded-[1px] bg-white"></div>
            <div className="bg-transparent"></div>
            <div className="rounded-[1px] bg-white"></div>
            <div className="rounded-[1px] bg-white"></div>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="text-sidebar-foreground text-[19px] leading-none font-bold tracking-tight">
              TreeForge
            </h1>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 px-1.5 py-0 text-[8px] leading-[14px] text-blue-500"
              >
                PRE-ALPHA
              </Badge>
              <span className="text-muted-foreground text-[10px] font-medium tracking-wide">
                v{pkg.version}
              </span>
            </div>
          </div>
        </div>

        {/* Add Repository Button */}
        <Button
          onClick={handleAddLocalRepo}
          className="h-10 w-full justify-center gap-2 border-0 bg-linear-to-r from-blue-400 to-blue-600 font-medium text-white shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all duration-300 hover:from-blue-500 hover:to-blue-700"
        >
          <Plus className="size-4" />
          {repoCount > 0 ? 'Add Repository' : 'New Repository'}
        </Button>

        {/* Navigation Top */}
        <nav className="-mx-2 flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors',
                item.isActive
                  ? 'text-tech-blue bg-white/5'
                  : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-white/5',
              )}
            >
              {item.isActive && (
                <div className="bg-tech-blue absolute top-1/2 left-0 h-[60%] w-[2px] -translate-y-1/2 rounded-r-full" />
              )}
              <item.icon className="size-[18px]" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Navigation Bottom */}
      <nav className="-mx-2 flex flex-col gap-1 px-4">
        {footerItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-muted-foreground hover:text-sidebar-foreground mx-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-white/5"
          >
            <item.icon className="size-[18px]" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
