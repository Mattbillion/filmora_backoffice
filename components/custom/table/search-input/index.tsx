// components/table/SearchInput.tsx
'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';

interface SearchInputProps {
  filterField: string; // e.g., "discount_name", "product_name"
  paramKey?: string; // default: "filters"
  placeholder?: string;
}

export function SearchInput({
  filterField,
  paramKey = 'filters',
  placeholder = 'Search...',
}: SearchInputProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState('');

  // Read from search params on load
  useEffect(() => {
    const param = searchParams.get(paramKey);
    const match = param?.match(new RegExp(`${filterField}=(.*)`));
    if (match?.[1]) {
      setValue(decodeURIComponent(match[1]));
    }
  }, [searchParams, paramKey, filterField]);

  // Debounced update
  const updateParams = debounce((val: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Remove previous value
    newParams.delete(paramKey);

    if (val) {
      newParams.set(paramKey, `${filterField}=${val}`);
    }

    router.push(`${pathname}?${newParams.toString()}`);
  }, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    updateParams(val);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-[300px]"
    />
  );
}
