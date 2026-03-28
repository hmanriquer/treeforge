import { forwardRef, useEffect, useState } from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/stores/search.store';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    const { query, setQuery } = useSearchStore();
    const [localValue, setLocalValue] = useState(query);

    useEffect(() => {
      setLocalValue(query);
    }, [query]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setQuery(localValue);
      }, 300);
      return () => clearTimeout(timeoutId);
    }, [localValue, setQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
      setLocalValue(e.target.value);

    return (
      <div
        className={cn('relative flex w-full items-center', containerClassName)}
      >
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search..."
          className={cn('pl-9', className)}
          ref={ref}
          {...props}
          value={localValue}
          onChange={handleSearch}
        />
      </div>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
