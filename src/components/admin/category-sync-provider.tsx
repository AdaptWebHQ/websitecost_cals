'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAdminCategoryStore } from '@/store/admin-category-store';
import { getServiceCategoriesAction } from '@/actions/service-category';

export default function CategorySyncProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, selectedCategoryId, setCategories, setSelectedCategoryId, setIsLoading } = useAdminCategoryStore();
  const activeSlugRef = useRef<string | null>(null);

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

  // 2. Synchronize URL and Store Bidirectionally (Safely)
  useEffect(() => {
    if (categories.length === 0) return;

    const urlCategorySlug = searchParams.get('category');
    const currentStoreCat = categories.find(c => c.id === selectedCategoryId);

    // Case 1: Store has a selected category that differs from our tracked active slug.
    // (This is triggered when category is changed via the UI select dropdown).
    if (currentStoreCat && currentStoreCat.slug !== activeSlugRef.current) {
      activeSlugRef.current = currentStoreCat.slug;
      
      // Update the URL to match the store if it differs
      if (urlCategorySlug !== currentStoreCat.slug) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', currentStoreCat.slug);
        router.replace(`${pathname}?${params.toString()}`);
      }
      return;
    }

    // Case 2: URL has a category slug that differs from our tracked active slug.
    // (This is triggered on initial load with URL parameters or back/forward navigation).
    if (urlCategorySlug && urlCategorySlug !== activeSlugRef.current) {
      const matchedCat = categories.find(c => c.slug === urlCategorySlug);
      if (matchedCat) {
        activeSlugRef.current = urlCategorySlug;
        if (selectedCategoryId !== matchedCat.id) {
          setSelectedCategoryId(matchedCat.id);
        }
      }
      return;
    }

    // Case 3: Initial fallback if neither store nor URL is tracked yet.
    if (!selectedCategoryId && !urlCategorySlug) {
      const localStoredId = localStorage.getItem('admin_selected_category_id');
      const defaultCat = categories.find(c => c.id === localStoredId) || 
                         categories.find(c => c.id === 'sc-website') || 
                         categories[0];
      if (defaultCat) {
        activeSlugRef.current = defaultCat.slug;
        setSelectedCategoryId(defaultCat.id);
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', defaultCat.slug);
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [categories, selectedCategoryId, searchParams, pathname, router, setSelectedCategoryId]);

  return <>{children}</>;
}
