"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useTransition,
} from "react";
import { getBannerProducts } from "./actions";
import { BannerBodyType, BannerProductType } from "./schema";

const BannerProductsContext = createContext<{
  products: Record<number, BannerProductType[]>;
  loading: boolean;
  getProducts: (type: BannerBodyType["product_type"]) => void;
}>({
  products: {},
  loading: true,
  getProducts: () => false,
});

export const BannerProductsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [products, setProducts] = useState<Record<number, BannerProductType[]>>(
    {}
  );
  const [pending, startTransition] = useTransition();

  return (
    <BannerProductsContext.Provider
      value={{
        products,
        loading: pending,
        getProducts: (type) =>
          startTransition(async () => {
            const { data } = await getBannerProducts(type);
            setProducts((c) => ({ ...c, [type]: data?.data ?? [] }));
          }),
      }}
    >
      {children}
    </BannerProductsContext.Provider>
  );
};

export const useBannerProducts = () => useContext(BannerProductsContext);
