import { invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ==========================================
// Types
// ==========================================
export interface GitCommit {
  hash: string;
  parents: string[];
  refs: string;
  subject: string;
  author: string;
  date: string;
}

export interface RecentActivityInfo {
  hash: string;
  author: string;
  timeAgo: string;
  message: string;
  additions: string;
  deletions: string;
}

export interface GitState {
  // Repository Management
  repoPath: string | null;
  savedRepos: string[];
  selectedRepo: string | null;

  // Repo Data
  branches: string[];
  currentBranch: string | null;
  commits: GitCommit[];
  recentActivities: RecentActivityInfo[];
  status: string | null;
  lastUsedBranches: Record<string, string>;

  // App State
  isLoading: boolean;
  error: string | null;
  stashList: string[];
}

export interface GitActions {
  // Repo Actions
  addRepo: (path: string) => void;
  removeRepo: (path: string) => void;
  selectRepo: (path: string) => void;

  // Git Actions
  fetchBranches: () => Promise<void>;
  fetchCurrentBranch: () => Promise<void>;
  fetchCommitLog: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
  fetchStatus: () => Promise<void>;
  commit: (message: string) => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<void>;
  checkout: (branch: string) => Promise<void>;
  gitFetch: () => Promise<void>;
  gitStashSave: (message?: string) => Promise<void>;
  gitStashPop: () => Promise<void>;
  fetchStashList: () => Promise<void>;
  createBranch: (name: string) => Promise<void>;
  sync: () => Promise<void>;

  // Utils
  clearError: () => void;
}

export type GitStore = GitState & GitActions;

// ==========================================
// Helpers
// ==========================================
const parseCommits = (rawLog: string): GitCommit[] => {
  if (!rawLog.trim()) return [];
  // Expected format from rust backend: %h|%p|%d|%s|%an|%ad
  return rawLog
    .split('\n')
    .map((line) => {
      const parts = line.split('|');
      return {
        hash: parts[0] ? parts[0].trim() : '',
        parents: parts[1] ? parts[1].trim().split(' ').filter(Boolean) : [],
        refs: parts[2] ? parts[2].trim() : '',
        subject: parts[3] ? parts[3].trim() : '',
        author: parts[4] ? parts[4].trim() : '',
        date: parts[5] ? parts[5].trim() : '',
      };
    })
    .filter((c) => c.hash);
};

const parseRecentActivities = (rawLog: string): RecentActivityInfo[] => {
  if (!rawLog.trim()) return [];
  
  const activities: RecentActivityInfo[] = [];
  const blocks = rawLog.split('COMMIT|').filter(Boolean);
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length === 0) continue;
    
    const headerParts = lines[0].split('|');
    const hash = headerParts[0] ? headerParts[0].trim() : '';
    const author = headerParts[1] ? headerParts[1].trim() : '';
    const timeAgo = headerParts[2] ? headerParts[2].trim() : '';
    const message = headerParts[3] ? headerParts[3].trim() : '';
    
    let adds = 0;
    let dels = 0;
    
    for (let i = 1; i < lines.length; i++) {
       const line = lines[i].trim();
       if (!line) continue;
       const statParts = line.split(/\s+/);
       if (statParts.length >= 2) {
          if (statParts[0] !== '-') adds += parseInt(statParts[0], 10) || 0;
          if (statParts[1] !== '-') dels += parseInt(statParts[1], 10) || 0;
       }
    }
    
    activities.push({
      hash: `#${hash}`,
      author,
      timeAgo,
      message,
      additions: `+${adds}`,
      deletions: `-${dels}`
    });
  }
  
  return activities;
};

// ==========================================
// Store Implementation
// ==========================================
export const useGitStore = create<GitStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        selectedRepo: null,
        repoPath: null,
        savedRepos: [],
        branches: [],
        currentBranch: null,
        commits: [],
        recentActivities: [],
        status: null,
        lastUsedBranches: {},
        stashList: [],
        isLoading: false,
        error: null,

        // ----------------------------------------
        // Repo Management
        // ----------------------------------------
        addRepo: (path: string) => {
          set((state) => ({
            savedRepos: state.savedRepos.includes(path)
              ? state.savedRepos
              : [...state.savedRepos, path],
            repoPath: path, // auto-select on add
            error: null,
          }));
        },

        removeRepo: (path: string) => {
          set((state) => {
            const newRepos = state.savedRepos.filter((r) => r !== path);
            return {
              savedRepos: newRepos,
              repoPath:
                state.repoPath === path ? newRepos[0] || null : state.repoPath,
            };
          });
        },

        selectRepo: async (path: string) => {
          set({
            selectedRepo: path,
            repoPath: path,
            error: null,
            branches: [],
            commits: [],
            recentActivities: [],
            status: null,
            currentBranch: null,
          });
          
          await get().fetchBranches();
          await get().fetchCurrentBranch();
          
          const { currentBranch, branches, lastUsedBranches } = get();
          const lastUsed = lastUsedBranches[path];

          let branchToSelect = lastUsed;
          
          if (!branchToSelect || !branches.includes(branchToSelect)) {
            if (branches.includes('main')) {
              branchToSelect = 'main';
            } else if (branches.includes('master')) {
              branchToSelect = 'master';
            } else if (branches.length > 0) {
              branchToSelect = branches[0];
            }
          }

          if (branchToSelect && branchToSelect !== currentBranch) {
            await get().checkout(branchToSelect);
          } else {
            // If already on the right branch or no branches exist
            if (branchToSelect) {
                set((state) => ({
                   lastUsedBranches: {
                     ...state.lastUsedBranches,
                     [path]: branchToSelect,
                   }
                }));
            }
            await get().fetchStatus();
            await get().fetchCommitLog();
            await get().fetchRecentActivities();
          }
        },

        // ----------------------------------------
        // Git Commands Wrap
        // ----------------------------------------
        fetchBranches: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            const result = await invoke<string>('get_branches', { repoPath });
            set({
              branches: result
                .split('\n')
                .map((b) => b.replace('*', '').trim())
                .filter(Boolean),
            });
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchCurrentBranch: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            const result = await invoke<string>('get_current_branch', {
              repoPath,
            });
            set({ currentBranch: result.trim() });
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchCommitLog: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            const result = await invoke<string>('get_graph_log', { repoPath });
            set({ commits: parseCommits(result) });
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchRecentActivities: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            const result = await invoke<string>('get_commit_stats_log', { repoPath });
            set({ recentActivities: parseRecentActivities(result) });
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchStatus: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            const result = await invoke<string>('get_status', { repoPath });
            set({ status: result });
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        commit: async (message: string) => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_commit', { repoPath, message });
            await get().fetchStatus();
            await get().fetchCommitLog();
            await get().fetchRecentActivities();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        push: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_push', { repoPath });
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        pull: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_pull', { repoPath });
            await get().fetchCommitLog(); // refresh commits
            await get().fetchRecentActivities();
            await get().fetchStatus();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        checkout: async (branch: string) => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_checkout', { repoPath, branch });
            
            set((state) => ({
              lastUsedBranches: {
                ...state.lastUsedBranches,
                [repoPath]: branch,
              },
              currentBranch: branch,
            }));

            await get().fetchBranches();
            await get().fetchStatus();
            await get().fetchCommitLog();
            await get().fetchRecentActivities();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        gitFetch: async () => {
          const { repoPath } = get();
          if (!repoPath) return;
          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_fetch', { repoPath });
            await get().fetchBranches();
            await get().fetchCommitLog();
            await get().fetchRecentActivities();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        gitStashSave: async (message = 'WIP') => {
          const { repoPath } = get();
          if (!repoPath) return;
          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_stash_save', { repoPath, message });
            await get().fetchStatus();
            await get().fetchStashList();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        gitStashPop: async () => {
          const { repoPath } = get();
          if (!repoPath) return;
          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_stash_pop', { repoPath });
            await get().fetchStatus();
            await get().fetchCommitLog();
            await get().fetchStashList();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchStashList: async () => {
          const { repoPath } = get();
          if (!repoPath) return;
          try {
            const result = await invoke<string>('git_stash_list', { repoPath });
            set({ stashList: result.split('\n').filter(Boolean) });
          } catch (e: any) {
            set({ error: e.toString() });
          }
        },

        createBranch: async (name: string) => {
          const { repoPath } = get();
          if (!repoPath) return;
          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_checkout_new_branch', { repoPath, branch: name });
            set((state) => ({
              currentBranch: name,
              lastUsedBranches: { ...state.lastUsedBranches, [repoPath]: name },
            }));
            await get().fetchBranches();
            await get().fetchCommitLog();
            await get().fetchRecentActivities();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        sync: async () => {
          const { repoPath } = get();
          if (!repoPath) return;
          set({ isLoading: true, error: null });
          try {
            await invoke<string>('git_pull', { repoPath });
            await invoke<string>('git_push', { repoPath });
            await get().fetchCommitLog();
            await get().fetchRecentActivities();
            await get().fetchStatus();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'treeforge-git-storage',
        // Only persist repo metadata
        partialize: (state) => ({
          savedRepos: state.savedRepos,
          repoPath: state.repoPath,
          lastUsedBranches: state.lastUsedBranches,
        }),
      },
    ),
  ),
);
