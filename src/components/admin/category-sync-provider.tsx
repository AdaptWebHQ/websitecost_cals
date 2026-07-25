'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAdminCategoryStore } from '@/store/admin-category-store';
import { getServiceCategoriesAction } from '@/actions/service-category';

export default function CategorySyncProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, selectedCategoryId, setCategories, setSelectedCategoryId, setIsLoading } = useAdminCategoryStore();

  // 1. Initial Load of categories
  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      try {
        const res = await getServiceCategoriesAction(true); // active only
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load service categories globally:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, [setCategories, setIsLoading]);

  // 2. Synchronize URL param `category` and localStorage into store
  useEffect(() => {
    if (categories.length === 0) return;

    const urlCategorySlug = searchParams.get('category');
    const localStoredId = localStorage.getItem('admin_selected_category_id');

    let targetId = selectedCategoryId;

    if (urlCategorySlug) {
      const match = categories.find(c => c.slug === urlCategorySlug);
      if (match) {
        targetId = match.id;
      }
    } else if (localStoredId) {
      const match = categories.find(c => c.id === localStoredId);
      if (match) {
        targetId = match.id;
      }
    }

    if (!targetId) {
      const defaultCat = categories.find(c => c.id === 'sc-website') || categories[0];
      targetId = defaultCat?.id || null;
    }

    if (targetId && targetId !== selectedCategoryId) {
      setSelectedCategoryId(targetId);
    }
  }, [categories, searchParams, selectedCategoryId, setSelectedCategoryId]);

  // 3. Synchronize store change back to URL parameter
  useEffect(() => {
    if (categories.length === 0 || !selectedCategoryId) return;

    const currentCat = categories.find(c => c.id === selectedCategoryId);
    if (!currentCat) return;

    const urlCategorySlug = searchParams.get('category');

    if (currentCat.slug !== urlCategorySlug) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', currentCat.slug);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [selectedCategoryId, categories, pathname, searchParams, router]);

  return <>{children}</>;
}
