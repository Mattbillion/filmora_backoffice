'use client';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUUID(str: string): boolean {
  return UUID_REGEX.test(str) || UUID_V4_REGEX.test(str);
}

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
                !isNaN(Number(c)) || isUUID(c)
                  ? `bc:${pageNames[idx - 1]}:${c}`
                  : `bc:${idx}`
              }
              className="capitalize"
            >
              {c}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Fragment>
      ))}
    </>
  );
}
