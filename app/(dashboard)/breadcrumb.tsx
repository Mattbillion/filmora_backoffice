'use client';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function BreadcrumbLastPage() {
  const pathname = usePathname();
  const pageNames = pathname.split('/').filter((c) => !!c);

  if (!pageNames?.length) return null;
  return (
    <>
      {pageNames.map((c, idx) => (
        <Fragment key={idx}>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage
              id={
                !isNaN(Number(c))
                  ? `bc:${pageNames[idx - 1]}:${c}`
                  : `bc:${idx}`
              }
              className="max-w-40 truncate capitalize"
            >
              {c}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Fragment>
      ))}
    </>
  );
}
