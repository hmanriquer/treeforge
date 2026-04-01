import { CloudDownload } from 'lucide-react';
import { FaArrowDown, FaArrowUp, FaCodeBranch } from 'react-icons/fa';
import { HiOutlineInboxArrowDown } from 'react-icons/hi2';
import { IoIosGitCompare } from 'react-icons/io';
import { toast } from 'sonner';

import { useGitStore } from '@/stores/git.store';

export type ToolbarActionId =
  | 'fetch'
  | 'pull'
  | 'push'
  | 'branch'
  | 'stash'
  | 'rebase';

export interface ToolbarAction {
  id: ToolbarActionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => Promise<void> | void;
  hasDialog?: boolean;
}

export const toolbarActions: ToolbarAction[] = [
  {
    id: 'fetch',
    label: 'Fetch',
    icon: CloudDownload,
    action: () => {
      useGitStore.getState().gitFetch();
      toast.success('Fetched successfully');
    },
  },
  {
    id: 'pull',
    label: 'Pull',
    icon: FaArrowDown,
    action: () => {
      useGitStore.getState().pull();
      toast.success('Pulled successfully');
    },
  },
  {
    id: 'push',
    label: 'Push',
    icon: FaArrowUp,
    action: () => {
      useGitStore.getState().push();
      toast.success('Pushed successfully');
    },
  },
  {
    id: 'branch',
    label: 'Branch',
    icon: FaCodeBranch,
    action: () => {},
    hasDialog: true,
  },
  {
    id: 'stash',
    label: 'Stash',
    icon: HiOutlineInboxArrowDown,
    action: () => {},
    hasDialog: true,
  },
  {
    id: 'rebase',
    label: 'Rebase',
    icon: IoIosGitCompare,
    action: () => {},
    hasDialog: true,
  },
];
