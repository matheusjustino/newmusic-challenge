import { api } from '@/lib/axios';

import { CategoryInterface } from '@/interfaces/categories/category.interface';
import { CreateCategoryInterface } from '@/interfaces/categories/create-category.interface';
import { UpdateCategoryInterface } from '@/interfaces/categories/update-category.interface';

export const getCategories = async (): Promise<CategoryInterface[]> => {
    return api.get<CategoryInterface[]>('/categories').then((res) => res.data);
};

export const createCategory = async (data: CreateCategoryInterface) => {
    return api
        .post<CategoryInterface>('/categories', data)
        .then((res) => res.data);
};

export const deleteCategory = async (id: string) => {
    return api.delete<boolean>(`/categories/${id}`).then((res) => res.data);
};

export const updateCategory = async (
    id: string,
    data: UpdateCategoryInterface,
) => {
    return api
        .patch<CategoryInterface>(`/categories/${id}`, data)
        .then((res) => res.data);
};
