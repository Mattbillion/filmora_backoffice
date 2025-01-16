"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getMagazineCategories } from "./actions";
import { MagazineCategoryItemType } from "./schema";

type MagazineCategoriesContextType = {
  categories: MagazineCategoryItemType[];
  loading: boolean;
};

const MagazineCategoriesContext = createContext<MagazineCategoriesContextType>({
  categories: [],
  loading: true,
});

export const MagazineCategoriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [categories, setMagazineCategories] = useState<
    MagazineCategoryItemType[]
  >([]);
  const [loading, setLoading] = useState(false);

  // TODO: update list when client modify list.
  useEffect(() => {
    setLoading(true);
    getMagazineCategories({ limit: 1000 })
      .then((res) => setMagazineCategories(res?.data?.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MagazineCategoriesContext.Provider value={{ categories, loading }}>
      {loading ? "Loading..." : children}
    </MagazineCategoriesContext.Provider>
  );
};

export const useMagazineCategories = () =>
  useContext(MagazineCategoriesContext);
