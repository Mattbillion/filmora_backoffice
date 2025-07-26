'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type PurchasableUpdateContextType = {
  updatePurchasable: (modifiedObj: Record<string, boolean>) => void;
  updatedPurchasable: Record<string, boolean>;
};

const PurchasableUpdateContext = createContext<
  PurchasableUpdateContextType | undefined
>(undefined);

export function PurchasableUpdateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [purchasableNodeObj, setPurchasableNodeObj] = useState<
    Record<string, boolean>
  >({});

  return (
    <PurchasableUpdateContext.Provider
      value={{
        updatePurchasable: (modifiedObj) =>
          setPurchasableNodeObj((prev) => ({ ...prev, ...modifiedObj })),
        updatedPurchasable: purchasableNodeObj,
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
