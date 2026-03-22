import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { invoke } from "@tauri-apps/api/core";

// ==========================================
// Types
// ==========================================
export interface GitCommit {
  hash: string;
  subject: string;
  author: string;
  date: string;
}

export interface GitState {
  // Repository Management
  repoPath: string | null;
  savedRepos: string[];
  
  // Repo Data
  branches: string[];
  commits: GitCommit[];
  status: string | null;
  
  // App State
  isLoading: boolean;
  error: string | null;
}

export interface GitActions {
  // Repo Actions
  addRepo: (path: string) => void;
  removeRepo: (path: string) => void;
  selectRepo: (path: string) => void;

  // Git Actions
  fetchBranches: () => Promise<void>;
  fetchCommitLog: () => Promise<void>;
  fetchStatus: () => Promise<void>;
  commit: (message: string) => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<void>;
  checkout: (branch: string) => Promise<void>;
  
  // Utils
  clearError: () => void;
}

export type GitStore = GitState & GitActions;

// ==========================================
// Helpers
// ==========================================
const parseCommits = (rawLog: string): GitCommit[] => {
  if (!rawLog.trim()) return [];
  // Expected format from rust backend: %h|%s|%an|%ad
  return rawLog
    .split("\n")
    .map((line) => {
      const parts = line.split("|");
      return {
        hash: parts[0] || "",
        subject: parts[1] || "",
        author: parts[2] || "",
        date: parts[3] || "",
      };
    })
    .filter((c) => c.hash);
};

// ==========================================
// Store Implementation
// ==========================================
export const useGitStore = create<GitStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        repoPath: null,
        savedRepos: [],
        branches: [],
        commits: [],
        status: null,
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
              repoPath: state.repoPath === path ? newRepos[0] || null : state.repoPath,
            };
          });
        },

        selectRepo: (path: string) => {
          set({ repoPath: path, error: null, branches: [], commits: [], status: null });
          // Automatically fetch essential data on switch
          get().fetchBranches();
          get().fetchStatus();
          get().fetchCommitLog();
        },

        // ----------------------------------------
        // Git Commands Wrap
        // ----------------------------------------
        fetchBranches: async () => {
          const { repoPath } = get();
          if (!repoPath) return;

          set({ isLoading: true, error: null });
          try {
            const result = await invoke<string>("get_branches", { repoPath });
            set({
              branches: result
                .split("\n")
                .map((b) => b.replace("*", "").trim())
                .filter(Boolean),
            });
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
            const result = await invoke<string>("get_commit_log", { repoPath });
            set({ commits: parseCommits(result) });
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
            const result = await invoke<string>("get_status", { repoPath });
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
            await invoke<string>("git_commit", { repoPath, message });
            await get().fetchStatus();
            await get().fetchCommitLog();
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
            await invoke<string>("git_push", { repoPath });
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
            await invoke<string>("git_pull", { repoPath });
            await get().fetchCommitLog(); // refresh commits
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
            await invoke<string>("git_checkout", { repoPath, branch });
            await get().fetchBranches();
            await get().fetchStatus();
            await get().fetchCommitLog();
          } catch (e: any) {
            set({ error: e.toString() });
          } finally {
            set({ isLoading: false });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "treeforge-git-storage",
        // Only persist repo metadata
        partialize: (state) => ({ 
          savedRepos: state.savedRepos,
          repoPath: state.repoPath
        }),
      }
    )
  )
);
