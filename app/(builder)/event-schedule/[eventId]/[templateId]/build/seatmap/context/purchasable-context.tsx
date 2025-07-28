'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useTransition,
} from 'react';

type PurchasableUpdateContextType = {
  updatePurchasable: (modifiedObj: Record<string, boolean>) => void;
  updatedPurchasable: Record<string, boolean>;
  forceUpdate: () => void;
};

const PurchasableUpdateContext = createContext<
  PurchasableUpdateContextType | undefined
>(undefined);

export function PurchasableUpdateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [_, setUpdateCount] = useState(0);
  const [_1, startTransition] = useTransition();
  const [purchasableNodeObj, setPurchasableNodeObj] = useState<
    Record<string, boolean>
  >({});

  return (
    <PurchasableUpdateContext.Provider
      value={{
        updatePurchasable: (modifiedObj) => {
          startTransition(() => {
            setPurchasableNodeObj((prev) => ({ ...prev, ...modifiedObj }));
          });
        },
        updatedPurchasable: purchasableNodeObj,
        forceUpdate: () => setUpdateCount((c) => c + 1),
      }}
    >
      {children}
    </PurchasableUpdateContext.Provider>
  );
}

export function usePurchasableUpdate() {
  const context = useContext(PurchasableUpdateContext);
  if (!context) {
    throw new Error(
      'usePurchasableUpdate must be used within a PurchasableUpdateProvider',
    );
  }
  return context;
}
