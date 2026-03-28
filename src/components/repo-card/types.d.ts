export type RepoCardProps = {
  name: string;
  path: string;
  branchName: string;
  status: 'synced' | 'unsynced' | 'conflict';
};
