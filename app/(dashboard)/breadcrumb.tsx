'use client';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';

import {
  BreadcrumbItem,
  BreadcrumbLink,
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
            {idx + 1 < pageNames.length ? (
              <BreadcrumbLink href={`/${c}`} className="capitalize">
                {c}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="capitalize">{c}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </Fragment>
      ))}
    </>
  );
}
