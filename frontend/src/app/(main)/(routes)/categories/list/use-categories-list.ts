import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { CategoryInterface } from '@/interfaces/categories/category.interface';
import { useCategoryStore } from '@/stores/category.store';
import {
    deleteCategory,
    updateCategory as updateCategoryApi,
} from '@/services/category.service';
import { queryClient } from '@/lib/query-client';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
});

export type CategoriesListFormType = z.infer<typeof formSchema & FieldValues>;

export const useCategoriesList = () => {
    const { categories, updateCategory, removeCategory } = useCategoryStore();

    const [selected, setSelected] = useState<CategoryInterface | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const defaultValues = useMemo(
        () => ({
            name: selected?.name ?? '',
            description: selected?.description ?? '',
        }),
        [selected?.id],
    );

    const form = useForm<CategoriesListFormType>({
        resolver: zodResolver(formSchema),
        defaultValues,
        values: defaultValues,
    });

    const deleteMutation = useMutation({
        mutationKey: ['delete-category'],
        mutationFn: async (id: string) => deleteCategory(id),
        onSuccess: async (_res, id) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['transactions'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['categories'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['balance'],
                }),
            ]);

            await Promise.all([
                queryClient.refetchQueries({
                    queryKey: ['balance'],
                }),
                queryClient.refetchQueries({
                    queryKey: ['transactions', 1],
                }),
            ]);

            removeCategory(id);
            toast.success('Category deleted successfully');
            closeDelete();
        },
        onError: (err: any) => {
            console.error(err);
            const errMsg =
                err?.response?.data?.message ??
                err?.message ??
                'Failed to delete category';
            toast.error(errMsg);
        },
    });

    const openEdit = useCallback((category: CategoryInterface) => {
        setSelected(category);
        setEditOpen(true);
    }, []);

    const openDelete = useCallback((category: CategoryInterface) => {
        setSelected(category);
        setDeleteOpen(true);
    }, []);

    const closeEdit = useCallback(() => {
        setEditOpen(false);
        setSelected(null);
    }, []);

    const closeDelete = useCallback(() => {
        setDeleteOpen(false);
        setSelected(null);
    }, []);

    const updateMutation = useMutation({
        mutationKey: ['update-category'],
        mutationFn: async (vars: {
            id: string;
            payload: { name: string; description: string };
        }) => updateCategoryApi(vars.id, vars.payload),
        onSuccess: async (_res, vars) => {
            updateCategory(vars.id, {
                name: vars.payload.name,
                description: vars.payload.description,
            });

            toast.success('Category updated successfully');
            closeEdit();
        },
        onError: (err: any) => {
            console.error(err);
            const errMsg =
                err?.response?.data?.message ??
                err?.message ??
                'Failed to update category';
            toast.error(errMsg);
        },
    });

    const handleSubmit: SubmitHandler<CategoriesListFormType> = useCallback(
        async (data, event) => {
            event?.preventDefault();
            if (!selected) return;
            updateMutation.mutate({
                id: selected.id,
                payload: { name: data.name, description: data.description },
            });
        },
        [selected?.id, updateMutation.mutate],
    );

    const confirmDelete = useCallback(() => {
        if (!selected) return;
        deleteMutation.mutate(selected.id);
    }, [selected?.id, deleteMutation.mutate]);

    return {
        categories,
        form,
        selected,
        editOpen,
        deleteOpen,
        setEditOpen,
        setDeleteOpen,
        openEdit,
        openDelete,
        closeEdit,
        closeDelete,
        handleSubmit,
        confirmDelete,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
