'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';

import { ID } from '@/lib/fetch/types';

import { getConnectProducts, getUser } from './actions';
import { ConnectProductType, UserType } from './schema';

type ProductAPIParams = Parameters<typeof getConnectProducts>[0];

const ConnectProductsContext = createContext<{
  products: Record<number | string, ConnectProductType[]>;
  users: Record<ID, UserType | undefined>;
  loading: boolean;
  getProducts: (params: ProductAPIParams) => void;
  getUser: (type: ID) => void;
    }>({
      users: {},
      products: {},
      loading: true,
      getProducts: () => false,
      getUser: () => false,
    });

export const ConnectProductsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [products, setProducts] = useState<
    Record<number | string, ConnectProductType[]>
  >({});
  const [user, setUser] = useState<Record<ID, UserType | undefined>>({});
  const [pending, startTransition] = useTransition();

  return (
    <ConnectProductsContext.Provider
      value={{
        products,
        users: user,
        loading: pending,
        getProducts: (params: ProductAPIParams) => {
          const type = params.purchaseType;
          const childId = params.trainingId || params.albumId;

          if (products[type])
            return products[childId ? `${type}:${childId}` : type];
          startTransition(async () => {
            const { data, error } = await getConnectProducts(params);

            if (error) toast.error((error as Error).message);
            else
              setProducts((c) => ({
                ...c,
                [childId ? `${type}:${childId}` : type]: data?.data ?? [],
              }));
          });
        },
        getUser: (userId: ID) => {
          if (user[userId]) return user[userId];
          startTransition(async () => {
            const { data, error } = await getUser(userId);

            if (error) toast.error((error as Error).message);
            else setUser((c) => ({ ...c, [userId]: data?.data }));
          });
        },
      }}
    >
      {children}
    </ConnectProductsContext.Provider>
  );
};

export const useConnectProducts = () => useContext(ConnectProductsContext);
