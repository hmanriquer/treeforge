import { FaSync } from 'react-icons/fa';
import { VscGitCommit } from 'react-icons/vsc';

import { SearchInput } from '../search-input';
import { Button } from '../ui/button';
import { toolbarActions } from './actions';

export function Toolbar() {
  return (
    <nav
      data-testid="main-toolbar"
      className="bg-background no-scrollbar flex h-14 w-full items-center justify-between gap-8 overflow-x-auto border-b border-neutral-900 px-4"
    >
      <section
        data-testid="toolbar-left"
        className="flex shrink-0 items-center gap-4 pr-2"
      >
        <SearchInput
          containerClassName="w-[320px]"
          placeholder="Search repositories or commits..."
          className="focus-visible:bg-card h-8 bg-black/20"
        />
        <div className="flex items-center gap-1 font-medium">
          {toolbarActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8"
            >
              <action.icon className="mr-1 size-3" />
              {action.label}
            </Button>
          ))}
        </div>
      </section>
      <section
        data-testid="toolbar-right"
        className="flex shrink-0 items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-8 font-medium">
            <FaSync className="mr-1 size-3" />
            Sync
          </Button>
          <Button
            size="sm"
            className="bg-tech-blue hover:bg-tech-blue/90 h-8 font-medium text-black"
          >
            <VscGitCommit className="mr-1 size-3" />
            Commit
          </Button>
        </div>
      </section>
    </nav>
  );
}
