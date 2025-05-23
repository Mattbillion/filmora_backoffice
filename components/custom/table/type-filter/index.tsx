'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TypeFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [type, setType] = useState('all');

  useEffect(() => {
    const filters = searchParams.get('filters');
    const match = filters?.match(/discount_type=(PERCENT|AMOUNT)/);
    if (match?.[1]) {
      setType(match[1]);
    } else {
      setType('all');
    }
  }, [searchParams]);

  // ✅ Update searchParams whenever `status` changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (type !== 'all') {
      params.set('filters', `discount_type=${type}`);
    } else {
      params.delete('filters');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [type]);

  return (
    <div className="flex items-center gap-2">
      <Select value={type} onValueChange={(value) => setType(value)}>
        <SelectTrigger className="min-w-[252px]">
          <SelectValue placeholder="Хямдралын төрөл" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem defaultChecked value="all">
              Бүгд (Хямдралын төрөл)
            </SelectItem>
            <SelectItem value="PERCENT">Хувиар</SelectItem>
            <SelectItem value="AMOUNT">Үнийн дүнгээр</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeFilter;
