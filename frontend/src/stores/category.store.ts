import { create } from 'zustand';

import { CategoryInterface } from '@/interfaces/categories/category.interface';

interface CategoryState {
    categories: CategoryInterface[];
    setCategories: (categories: CategoryInterface[]) => void;
    addCategory: (category: CategoryInterface) => void;
    updateCategory: (id: string, data: Partial<CategoryInterface>) => void;
    removeCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    addCategory: (category) =>
        set((state) => ({
            categories: [...state.categories, category],
        })),
    updateCategory: (id, data) =>
        set((state) => ({
            categories: state.categories.map((cat) =>
                cat.id === id ? { ...cat, ...data } : cat,
            ),
        })),
    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((cat) => cat.id !== id),
        })),
}));
