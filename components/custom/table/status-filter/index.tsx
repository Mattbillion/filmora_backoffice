'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [statusFilter, setStatusFilter] = useState('');

  // Set initial state from URL
  useEffect(() => {
    const filtersParam = searchParams.get('filters');
    const match = filtersParam?.match(/status=(.*)/);
    if (match?.[1]) {
      setStatusFilter(match[1]);
    }
  }, [searchParams]);

  // Sync value to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove old filter
    params.delete('filters');

    if (statusFilter) {
      params.set('filters', `status=${statusFilter}`);
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [statusFilter]);

  return (
    <Select
      value={statusFilter}
      onValueChange={(value) => setStatusFilter(value)}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Active</SelectItem>
        <SelectItem value="false">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
}
