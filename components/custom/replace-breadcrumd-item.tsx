'use client';

import { useEffect } from 'react';

export function ReplaceBreadcrumdItem({
  data = {},
}: {
  data?: Record<string, { selector: any; value?: string }>;
}) {
  useEffect(() => {
    Object.entries(data).forEach(([key, obj]) => {
      const el = document.getElementById(`bc:${key}:${obj.selector}`);
      if (el) {
        el.innerText = obj.value || obj.selector;
        if (obj.value) el.setAttribute('title', obj.value);
      }
    });
  }, [data]);
  return null;
}
