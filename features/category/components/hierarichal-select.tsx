import { useEffect, useState } from 'react';

import { HierarchicalCategory } from '@/features/category/schema';
import { ID } from '@/lib/fetch/types';

interface HierarchicalSelectProps {
  categories: HierarchicalCategory[];
  value?: ID;
  onChange: (value?: ID) => void;
  disabled?: boolean;
  depthLimit?: number;
}

const findCategoryPath = (
  categories: HierarchicalCategory[],
  id: ID,
): HierarchicalCategory[] => {
  if (!id) return [];

  const findPath = (
    currentCategories: HierarchicalCategory[],
    path: HierarchicalCategory[],
  ): HierarchicalCategory[] | null => {
    for (const category of currentCategories) {
      if (category.id === id) return [...path, category];
      if (category.children.length > 0) {
        const result = findPath(category.children, [...path, category]);
        if (result) return result;
      }
    }
    return null;
  };

  return findPath(categories, []) || [];
};

export const HierarchicalSelect = ({
  categories,
  value,
  onChange,
  disabled,
  depthLimit = 3,
}: HierarchicalSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] =
    useState<HierarchicalCategory[]>(categories);
  const [breadcrumbs, setBreadcrumbs] = useState<HierarchicalCategory[]>([]);

  useEffect(() => {
    if (value) {
      const path = findCategoryPath(categories, value).slice(0, depthLimit - 1);
      if (path.length > 0) {
        const selectedCategory = path[path.length - 1];
        if (selectedCategory.children.length === 0) {
          const newBreadcrumbs = path.slice(0, -1);
          let newCurrentLevel = categories;

          newBreadcrumbs.forEach((crumb) => {
            newCurrentLevel = crumb.children;
          });

          setCurrentLevel(newCurrentLevel);
          setBreadcrumbs(newBreadcrumbs);
        }
      }
    } else {
      setCurrentLevel(categories);
      setBreadcrumbs([]);
    }
  }, [value, categories]);

  const handleSelect = (category: HierarchicalCategory) => {
    if (category.children.length > 0 && breadcrumbs.length < depthLimit - 1) {
      setCurrentLevel(category.children);
      setBreadcrumbs([...breadcrumbs, category]);
    } else {
      setIsOpen(false);
    }
    onChange(category.id);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index);
    const newLevel = index === 0 ? categories : breadcrumbs[index - 1].children;

    setBreadcrumbs(newBreadcrumbs);
    setCurrentLevel(newLevel);
  };

  return (
    <div className="relative w-full max-w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Select category"
        className="flex w-full items-center justify-between rounded border p-2 hover:bg-accent"
      >
        <span className="truncate">
          {value
            ? findCategoryPath(categories, value)
                .map((c) => c.cat_name)
                .join(' › ')
            : 'Select a category'}
        </span>
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded border bg-background shadow-lg">
          <div className="max-h-80 overflow-y-auto p-2">
            {breadcrumbs.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentLevel(categories);
                    setBreadcrumbs([]);
                  }}
                  className="flex items-center rounded px-2 py-1 text-sm hover:bg-accent"
                >
                  <span className="mx-1">←</span>
                  Back
                </button>
                {breadcrumbs.map((crumb, index) => (
                  <button
                    key={crumb.id}
                    type="button"
                    onClick={() => handleBreadcrumbClick(index + 1)}
                    className="flex items-center rounded px-2 py-1 text-sm hover:bg-accent"
                  >
                    {crumb.cat_name}
                    <span className="mx-1">›</span>
                  </button>
                ))}
              </div>
            )}

            {currentLevel.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category)}
                className={`flex w-full items-center justify-between rounded p-2 text-left ${
                  value === category.id ? 'bg-accent' : 'hover:bg-accent'
                }`}
              >
                <span>{category.cat_name}</span>
                {category.children.length > 0 &&
                breadcrumbs.length < depthLimit - 1 ? (
                  <span className="text-gray-500">→</span>
                ) : (
                  value === category.id && (
                    <span className="text-foreground">✓</span>
                  )
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
