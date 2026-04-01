import { Plus } from 'lucide-react';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { VscNewFolder } from 'react-icons/vsc';

import { Button } from '../ui/button';
import type { HeaderProps } from './types';

export function Header({
  cloneRepository,
  createRepository,
  addLocalRepository,
}: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between">
      <section className="max-w-lg space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          TreeForge Workspace
        </h1>
        <p className="text-muted-foreground text-lg">
          A specialized environment for high-frequency code iteration. Manage
          your local git repositories and global sync state.
        </p>
      </section>
      <section className="flex gap-3">
        <Button variant="outline" onClick={cloneRepository}>
          <IoCloudDownloadOutline className="mr-2 size-4 text-blue-400" />
          Clone Repository
        </Button>
        <Button variant="outline" onClick={createRepository}>
          <Plus className="mr-2 size-4 text-green-400" />
          Create New
        </Button>
        <Button variant="default" onClick={addLocalRepository}>
          <VscNewFolder className="mr-2 size-4" />
          Add Local Repo
        </Button>
      </section>
    </header>
  );
}
