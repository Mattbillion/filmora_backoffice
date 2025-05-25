'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Loader2, Search, X } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getOptionTypesList } from '@/features/option-types/actions';
import { OptionTypesItemType } from '@/features/option-types/schema';
import { cn } from '@/lib/utils';

interface ServerAutocompleteProps {
  onSelect?: (result: OptionTypesItemType) => void;
}

export default function AddOptionType({ onSelect }: ServerAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OptionTypesItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          setIsLoading(true);
          setIsOpen(true);
          getOptionTypesList({
            page: 1,
            page_size: 10,
            filters: `option_name=${searchQuery}`,
          }).then((c) => setResults(c.data.data || []));
          try {
            setResults([]);
          } catch (err) {
            setResults([]);
          } finally {
            setIsLoading(false);
          }
        }, 800);
      };
    }, []),
    [],
  );

  useEffect(() => {
    getOptionTypesList({
      page: 1,
      page_size: 10,
    }).then((c) => setResults(c.data.data || []));
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length === 0) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
    } else {
      debouncedSearch(value);
    }
  };

  // Handle result selection
  const handleSelect = (result: OptionTypesItemType) => {
    setQuery('');
    setIsOpen(false);
    onSelect?.(result);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          Add Option Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={'relative'} ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              placeholder="Search option type"
            />
            {isLoading && (
              <Loader2 className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
            {query && !isLoading && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
              {results.length > 0 ? (
                <div className="max-h-60 overflow-auto">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className={cn(
                        'cursor-pointer px-3 py-2 text-sm hover:bg-accent',
                      )}
                      onClick={() => handleSelect(result)}
                    >
                      <div className="font-medium">{`${result.option_name}  | ${result.option_name_mn}`}</div>
                    </div>
                  ))}
                </div>
              ) : !isLoading ? (
                <div className="p-3 text-sm text-muted-foreground">
                  No results found for {`${query}`}
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
