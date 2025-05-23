'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const StatusFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('all');

  useEffect(() => {
    const filters = searchParams.get('filters');
    const match = filters?.match(/status=(true|false)/);
    if (match?.[1]) {
      setStatus(match[1]);
    } else {
      setStatus('all');
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Step 1: Parse filters into object
    const filtersRaw = params.get('filters');
    const filters: Record<string, string> = {};

    if (filtersRaw) {
      filtersRaw.split(',').forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key && value) filters[key] = value;
      });
    }

    // Step 2: Update or remove status
    if (status !== 'all') {
      filters['status'] = status;
    } else {
      delete filters['status'];
    }

    // Step 3: Re-serialize and set new filters
    const serializedFilters = Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    if (serializedFilters) {
      params.set('filters', serializedFilters);
    } else {
      params.delete('filters');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Төлөв сонгох" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem defaultChecked value="all">
              Бүгд (Төлөв)
            </SelectItem>
            <SelectItem value="true">
              <Badge
                variant="outline"
                className="rounded-md bg-green-600 text-white"
              >
                Идэвхтэй
              </Badge>
            </SelectItem>
            <SelectItem value="false">
              <Badge variant="destructive">Идэвхгүй</Badge>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
