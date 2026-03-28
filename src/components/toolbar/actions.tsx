import { CloudDownload } from 'lucide-react';
import { FaArrowDown, FaArrowUp, FaCodeBranch } from 'react-icons/fa';
import { HiOutlineInboxArrowDown } from 'react-icons/hi2';

export const toolbarActions = [
  {
    id: 'fetch',
    label: 'Fetch',
    icon: CloudDownload,
    action: () => {},
  },
  {
    id: 'pull',
    label: 'Pull',
    icon: FaArrowDown,
    action: () => {},
  },
  {
    id: 'push',
    label: 'Push',
    icon: FaArrowUp,
    action: () => {},
  },
  {
    id: 'branch',
    label: 'Branch',
    icon: FaCodeBranch,
    action: () => {},
  },
  {
    id: 'stash',
    label: 'Stash',
    icon: HiOutlineInboxArrowDown,
    action: () => {},
  },
];
