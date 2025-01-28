'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getTags } from './actions';
import { TagItemType } from './schema';

type TagsContextType = {
  tags: TagItemType[];
  loading: boolean;
};

const TagsContext = createContext<TagsContextType>({ tags: [], loading: true });

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<TagItemType[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: update list when client modify list.
  useEffect(() => {
    setLoading(true);
    getTags()
      .then((res) => setTags(res?.data?.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TagsContext.Provider value={{ tags, loading }}>
      {loading ? 'Loading...' : children}
    </TagsContext.Provider>
  );
};

export const useTags = () => useContext(TagsContext);
