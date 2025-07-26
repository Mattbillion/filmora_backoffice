'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import PurchasableList from './_components/purchasable-list';
import { TypedNode } from './seatmap';
import { PurchasableUpdateProvider } from './seatmap/context/purchasable-context';

const StageProvider = dynamic(() => import('./seatmap/context/stage'), {
  ssr: false,
});

const ZoomControl = dynamic(() => import('./_components/zoom-control'), {
  ssr: false,
});

export default function ScheduleBuildClient({
  stage,
  tickets,
  children,
}: {
  stage: TypedNode;
  tickets: TypedNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-1 gap-4">
      <PurchasableUpdateProvider>
        <StageProvider
          stageJson={stage}
          ticketsJson={tickets}
          containerClassName="relative h-full bg-[#fafafa]"
          addonBefore={
            <>
              <div className="absolute right-4 top-4 z-10">
                <ZoomControl />
              </div>
            </>
          }
          stageContainerWrapper={StageWrapper}
        >
          <div className="w-96 border-l bg-white">
            <div className="border-b p-4">{children}</div>
            <div className="p-4">
              <PurchasableList />
            </div>
          </div>
        </StageProvider>
      </PurchasableUpdateProvider>
    </div>
  );
}

const StageWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="flex-1">{children}</div>;
};
