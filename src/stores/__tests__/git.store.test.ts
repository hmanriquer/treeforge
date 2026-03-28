import { invoke } from '@tauri-apps/api/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGitStore } from '../git.store';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('git.store', () => {
  beforeEach(() => {
    // Reset store state completely between tests
    useGitStore.setState({
      repoPath: null,
      savedRepos: [],
      branches: [],
      commits: [],
      status: null,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('adds and selects a repo correctly', () => {
    const store = useGitStore.getState();
    store.addRepo('/path/to/repo');

    const state = useGitStore.getState();
    expect(state.savedRepos).toContain('/path/to/repo');
    expect(state.repoPath).toBe('/path/to/repo');
    expect(state.error).toBeNull();
  });

  it('does not duplicate saved repos', () => {
    useGitStore.setState({ savedRepos: ['/repo1'] });
    useGitStore.getState().addRepo('/repo1');

    expect(useGitStore.getState().savedRepos).toHaveLength(1);
    expect(useGitStore.getState().repoPath).toBe('/repo1');
  });

  it('removes a repo correctly', () => {
    useGitStore.setState({
      savedRepos: ['/repo1', '/repo2'],
      repoPath: '/repo1',
    });

    useGitStore.getState().removeRepo('/repo1');

    const state = useGitStore.getState();
    expect(state.savedRepos).not.toContain('/repo1');
    // Since repo1 was active, it falls back to the next available repo
    expect(state.repoPath).toBe('/repo2');
  });

  it('fetches branches successfully', async () => {
    useGitStore.setState({ repoPath: '/my/repo' });

    // Mock the invoke response for "get_branches"
    (invoke as any).mockResolvedValue('* main\n  feature-branch\n');

    await useGitStore.getState().fetchBranches();

    expect(invoke).toHaveBeenCalledWith('get_branches', {
      repoPath: '/my/repo',
    });
    expect(useGitStore.getState().branches).toEqual(['main', 'feature-branch']);
    expect(useGitStore.getState().error).toBeNull();
    expect(useGitStore.getState().isLoading).toBe(false);
  });

  it('fetches commit log successfully and parses format', async () => {
    useGitStore.setState({ repoPath: '/my/repo' });
    (invoke as any).mockResolvedValue(
      'abcdef|Initial Commit|John Doe|2023-10-10\n123456|Second Commit|Jane Doe|2023-10-11',
    );

    await useGitStore.getState().fetchCommitLog();

    const commits = useGitStore.getState().commits;
    expect(commits).toHaveLength(2);
    expect(commits[0]).toEqual({
      hash: 'abcdef',
      subject: 'Initial Commit',
      author: 'John Doe',
      date: '2023-10-10',
    });
  });

  it('executes a commit successfully and auto-refreshes data', async () => {
    useGitStore.setState({ repoPath: '/my/repo' });

    // We expect fetchStatus and fetchCommitLog after git_commit
    (invoke as any)
      .mockResolvedValueOnce('success') // git_commit
      .mockResolvedValueOnce(' M file.txt') // get_status
      .mockResolvedValueOnce('abcdef|Msg|Me|Date'); // get_commit_log

    await useGitStore.getState().commit('My message');

    expect(invoke).toHaveBeenCalledWith('git_commit', {
      repoPath: '/my/repo',
      message: 'My message',
    });
    expect(invoke).toHaveBeenCalledWith('get_status', { repoPath: '/my/repo' });
    expect(invoke).toHaveBeenCalledWith('get_commit_log', {
      repoPath: '/my/repo',
    });
    expect(useGitStore.getState().error).toBeNull();
  });

  it('handles backend invoke errors correctly', async () => {
    useGitStore.setState({ repoPath: '/my/repo' });
    (invoke as any).mockRejectedValue('Fatal git error');

    await useGitStore.getState().pull();

    expect(useGitStore.getState().error).toBe('Fatal git error');
    expect(useGitStore.getState().isLoading).toBe(false);
  });
});
