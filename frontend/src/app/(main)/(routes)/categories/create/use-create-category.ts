import { useCallback } from 'react';
import { z } from 'zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/lib/query-client';

import { CategoryInterface } from '@/interfaces/categories/category.interface';

import { useCategoryStore } from '@/stores/category.store';

import { createCategory } from '@/services/category.service';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

export const useCreateCategory = () => {
    const { categories, addCategory } = useCategoryStore();

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const submitMutation = useMutation({
        mutationKey: ['create-category'],
        mutationFn: async (data: FormType) => {
            return createCategory(data);
        },
    });

    const handleSubmit: SubmitHandler<FormType> = useCallback(
        async (data, event) => {
            event?.preventDefault();

            try {
                toast.promise(submitMutation.mutateAsync(data), {
                    loading: 'Submitting...',
                    success: (response: CategoryInterface) => {
                        queryClient.setQueryData<CategoryInterface[]>(
                            ['categories'],
                            (oldData) => {
                                if (!oldData) return [];
                                return [...categories, response];
                            },
                        );

                        addCategory(response);

                        form.reset();

                        return 'Category created successfully';
                    },
                    error: (err) => {
                        console.error(err.response);
                        const errMsg =
                            err?.response?.data?.message ??
                            err?.message ??
                            `Something went wrong`;
                        return errMsg;
                    },
                });
            } catch (e) {
                console.error(e);
                toast.error('Something went wrong');
            }
        },
        [form.getValues()],
    );

    return {
        form,
        handleSubmit,
        isLoading: submitMutation.isPending,
    };
};
