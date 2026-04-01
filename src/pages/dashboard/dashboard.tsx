import { BottomBar } from '@/components/bottom-bar';
import { GitGraph } from '@/components/git-graph';
import { RecentActivity } from '@/components/recent-activity';
import { RepoTabs } from '@/components/repo-tabs';
import { Sidebar } from '@/components/sidebar';
import { Toolbar } from '@/components/toolbar';

export function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Repository tab strip */}
          <RepoTabs />

          {/* Main toolbar */}
          <Toolbar />

          <div className="animate-in fade-in flex flex-1 flex-row overflow-hidden bg-zinc-950 duration-500">
            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden p-6">
              <div className="mb-6 flex w-full items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Repository History
                </h2>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden">
                <GitGraph />
              </div>
            </div>

            {/* Right Panel */}
            <RecentActivity />
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
