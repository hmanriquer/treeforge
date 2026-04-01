import { useGitStore } from '@/stores/git.store';

export function RecentActivity() {
  const recentActivities = useGitStore((state) => state.recentActivities);

  return (
    <div className="flex w-96 flex-col bg-zinc-900 border-l border-white/10 overflow-y-auto">
      <div className="px-6 py-6">
        <h3 className="mb-6 text-sm font-bold tracking-widest text-zinc-100">
          RECENT ACTIVITY
        </h3>
        <div className="flex flex-col gap-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.hash}
              className="group relative flex flex-col rounded-lg bg-zinc-950/50 border border-white/5 p-4 transition-colors hover:bg-zinc-800/80"
            >
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activity.author
                    )}&background=random&color=fff`}
                    alt={activity.author}
                    className="h-7 w-7 rounded-full object-cover shadow-sm"
                  />
                  <span className="text-sm font-semibold text-zinc-100">
                    {activity.author}
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-500">
                  {activity.timeAgo}
                </span>
              </div>

              {/* Message */}
              <p className="mb-4 text-sm text-zinc-300 leading-relaxed">
                {activity.message}
              </p>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between">
                <span className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-400">
                  {activity.hash}
                </span>
                <div className="flex items-center gap-3 font-mono text-xs font-bold">
                  <span className="text-emerald-500">{activity.additions}</span>
                  <span className="text-rose-500">{activity.deletions}</span>
                </div>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
             <div className="text-sm text-zinc-500 text-center py-6">
               No recent activity found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
