'use client';

import { useState } from 'react';
import { result, set as lodashSet, unset } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { objToQs, qsToObj } from '@/lib/utils';

const YearRangeFilter = ({ name = 'filters.year' }: { name?: string }) => {
  const searchParams = useSearchParams();
  const queryParams = qsToObj(searchParams.toString());
  const router = useRouter();

  const [minYear, setMinYear] = useState<string>(
    result(queryParams, `${name}.min`) || '',
  );
  const [maxYear, setMaxYear] = useState<string>(
    result(queryParams, `${name}.max`) || '',
  );

  const handleYearChange = (field: 'min' | 'max', value: string) => {
    const paramsObj = { ...queryParams };

    if (value) {
      lodashSet(paramsObj, `${name}.${field}`, value);
    } else {
      unset(paramsObj, `${name}.${field}`);
    }

    // Clean up empty year object
    if (
      paramsObj.filters?.year &&
      !paramsObj.filters.year.min &&
      !paramsObj.filters.year.max
    ) {
      unset(paramsObj, 'filters.year');
    }

    if (paramsObj.filters) {
      paramsObj.filters = Object.entries(paramsObj.filters)
        .map(([k, v]) => {
          if (typeof v === 'object' && v !== null) {
            return Object.entries(v)
              .map(([subK, subV]) => `${k}.${subK}=${subV}`)
              .join(',');
          }
          return `${k}=${v}`;
        })
        .join(',');
    }

    router.replace(`?${objToQs(paramsObj)}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="min-year" className="text-sm font-medium">
          Year:
        </Label>
        <Input
          id="min-year"
          type="number"
          placeholder="Min"
          value={minYear}
          onChange={(e) => {
            setMinYear(e.target.value);
            handleYearChange('min', e.target.value);
          }}
          className="h-9 w-20"
          min="1900"
          max="2030"
        />
        <span className="text-muted-foreground text-sm">-</span>
        <Input
          id="max-year"
          type="number"
          placeholder="Max"
          value={maxYear}
          onChange={(e) => {
            setMaxYear(e.target.value);
            handleYearChange('max', e.target.value);
          }}
          className="h-9 w-20"
          min="1900"
          max="2030"
        />
      </div>
    </div>
  );
};

export default YearRangeFilter;
