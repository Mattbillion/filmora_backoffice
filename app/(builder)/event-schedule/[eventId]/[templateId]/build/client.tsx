'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { TypedNode } from './seatmap';

const StageProvider = dynamic(() => import('./seatmap/context/stage'), {
  ssr: false,
});

export default function ScheduleBuildClient({
  stage,
  tickets,
}: {
  stage: TypedNode;
  tickets: TypedNode;
}) {
  return (
    <div className="flex h-full flex-1 gap-4">
      <StageProvider
        stageJson={stage}
        ticketsJson={tickets}
        containerClassName="relative h-full"
        stageContainerWrapper={StageWrapper}
      >
        <div className="w-96 border-l border-border">sda</div>
      </StageProvider>
    </div>
  );
}

const StageWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="flex-1">{children}</div>;
};
