import { useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { TransactionTypeEnum } from '@/enums/transaction-type.enum';
import { TransactionInterface } from '@/interfaces/transactions/transaction.interface';
import { useCategoryStore } from '@/stores/category.store';
import { createTransaction } from '@/services/transaction.service';
import { GetTransactionsResponseInterface } from '@/interfaces/transactions/get-transactions-response.interface';

const numberRegex = /^\d+(\.\d+)?$/;
const formSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z
        .string()
        .regex(numberRegex, { message: 'Must be a valid positive number' })
        .refine((value) => parseFloat(value) > 0, {
            message: 'Value must be greater than 0',
        }),
    type: z.nativeEnum(TransactionTypeEnum),
    categoryId: z.string().min(1, 'Category is required'),
    date: z
        .string()
        .min(1, 'Date is required')
        .refine((val) => {
            const todayStr = new Date().toISOString().split('T')[0];
            return val <= todayStr;
        }, 'Future dates are not allowed'),
    isExtra: z.boolean(),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

export const useTransactionsCreate = () => {
    const { categories } = useCategoryStore();

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: 'a',
            type: TransactionTypeEnum.EXPENSE,
            categoryId: categories[0]?.id ?? '',
            amount: '1',
            date: new Date().toISOString().split('T')[0],
            isExtra: false,
        },
    });

    const submitMutation = useMutation({
        mutationKey: ['submit-transaction'],
        mutationFn: async (data: FormType): Promise<TransactionInterface> => {
            return createTransaction({
                ...data,
                amount: Number(data.amount),
            });
        },
        onSuccess: async (response) => {
            queryClient.setQueryData<GetTransactionsResponseInterface>(
                ['transactions', 1],
                (oldData) => {
                    if (!oldData) return oldData;

                    const newData = {
                        data: [response, ...oldData.data.slice(0, 9)],
                        meta: {
                            ...oldData.meta,
                            totalItems: oldData.meta.totalItems + 1,
                            totalPages: Math.ceil(
                                (oldData.meta.totalItems + 1) / 10,
                            ),
                        },
                    };

                    return { ...newData };
                },
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['transactions'],
                }),
                queryClient.refetchQueries({
                    queryKey: ['balance'],
                }),
            ]);

            // await queryClient.refetchQueries({
            //     queryKey: ['transactions', 1],
            // });
        },
    });

    const handleSubmit: SubmitHandler<FormType> = useCallback(
        async (data, event) => {
            event?.preventDefault();

            try {
                toast.promise(submitMutation.mutateAsync(data), {
                    loading: 'Submitting...',
                    success: () => {
                        form.reset();
                        return 'Transaction created successfully';
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
        categories,
    };
};
