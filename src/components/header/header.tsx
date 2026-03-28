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
        <h1 className="text-2xl font-bold tracking-tight">
          Architect Workspace
        </h1>
        <p className="text-muted-foreground">
          A specialized envronment for high-frequencyt coe iteration. Manage
          your local forged repositories and gobal sync state.
        </p>
      </section>
      <section className="flex gap-2">
        <Button variant="outline" onClick={cloneRepository}>
          <IoCloudDownloadOutline className="size-4 text-blue-400" />
          Clone Repository
        </Button>
        <Button variant="outline" onClick={createRepository}>
          <Plus className="size-4 text-green-400" />
          Create New
        </Button>
        <Button variant="outline" onClick={addLocalRepository}>
          <VscNewFolder className="size-4 text-gray-500" />
          Add Local Repo
        </Button>
      </section>
    </header>
  );
}
