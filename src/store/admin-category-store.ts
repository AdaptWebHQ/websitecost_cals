import { create } from 'zustand';
import type { ServiceCategory } from '@/types';

interface AdminCategoryState {
  categories: ServiceCategory[];
  selectedCategoryId: string | null;
  selectedCategory: ServiceCategory | null;
  isLoading: boolean;
  setCategories: (categories: ServiceCategory[]) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAdminCategoryStore = create<AdminCategoryState>((set, get) => ({
  categories: [],
  selectedCategoryId: null,
  selectedCategory: null,
  isLoading: false,
  setCategories: (categories) => {
    const selectedId = get().selectedCategoryId;
    let selected = categories.find(c => c.id === selectedId) || null;
    if (categories.length > 0 && !selected) {
      const localId = typeof window !== 'undefined' ? localStorage.getItem('admin_selected_category_id') : null;
      selected = categories.find(c => c.id === localId) || categories.find(c => c.id === 'sc-website') || categories[0];
    }
    set({
      categories,
      selectedCategory: selected,
      selectedCategoryId: selected ? selected.id : null,
    });
  },
  setSelectedCategoryId: (id) => {
    const categories = get().categories;
    const selected = categories.find(c => c.id === id) || null;
    if (id && typeof window !== 'undefined') {
      localStorage.setItem('admin_selected_category_id', id);
    }
    set({
      selectedCategoryId: id,
      selectedCategory: selected,
    });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
}));
