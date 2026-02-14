'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useCategoryStore } from '@/stores/category.store';
import {
    getTransactions,
    deleteTransaction as deleteTransactionApi,
} from '@/services/transaction.service';
import { GetTransactionsResponseInterface } from '@/interfaces/transactions/get-transactions-response.interface';
import { TransactionInterface } from '@/interfaces/transactions/transaction.interface';
import { TransactionTypeEnum } from '@/enums/transaction-type.enum';
import { updateTransaction as updateTransactionApi } from '@/services/transaction.service';
import { useTransactionStore } from '@/stores/transaction.store';
import { queryClient } from '@/lib/query-client';

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

export const useTransactionsList = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { updateTransaction, removeTransaction } = useTransactionStore();
    const [selected, setSelected] = useState<TransactionInterface | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const defaultValues = {
        description: selected?.description ?? '',
        amount: `${selected?.amount ?? ''}`,
        categoryId: selected?.categoryId ?? '',
        date: selected?.date ? selected.date.slice(0, 10) : '',
        isExtra: selected?.isExtra ?? false,
        type: selected?.type ?? TransactionTypeEnum.EXPENSE,
    };
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues,
        values: defaultValues,
    });

    const { categories } = useCategoryStore();

    const getTransactionsQuery = useQuery({
        queryKey: ['transactions', page],
        queryFn: async () => {
            return await getTransactions({
                page: page - 1,
                limit,
            });
        },
        placeholderData: (previousData) => previousData,
    });

    const handleNavigate = async (page: number) => {
        setPage(page);
    };

    const defaultData: GetTransactionsResponseInterface = {
        data: [],
        meta: {
            currentPage: 1,
            totalItems: 0,
            totalPages: 0,
            itemsPerPage: 0,
        },
    };

    const openEdit = (tx: TransactionInterface) => {
        setSelected(tx);
        setEditOpen(true);
    };

    const openDelete = (tx: TransactionInterface) => {
        setSelected(tx);
        setDeleteOpen(true);
    };

    const updateMutation = useMutation({
        mutationKey: ['update-transaction'],
        mutationFn: async (vars: { id: string; payload: FormType }) =>
            updateTransactionApi(vars.id, {
                description: vars.payload.description,
                amount: Number(vars.payload.amount),
                type: vars.payload.type,
                categoryId: vars.payload.categoryId,
                date: new Date(vars.payload.date),
                isExtra: !!vars.payload.isExtra,
            }),
        onSuccess: async (_res, vars) => {
            updateTransaction(vars.id, {
                description: vars.payload.description,
                amount: Number(vars.payload.amount),
                type: vars.payload.type,
                categoryId: vars.payload.categoryId,
                date: vars.payload.date,
                isExtra: !!vars.payload.isExtra,
            });

            queryClient.setQueryData<GetTransactionsResponseInterface>(
                ['transactions', page],
                (oldData) => {
                    if (!oldData) return oldData;

                    const updated = oldData.data.map((tx) =>
                        tx.id === vars.id
                            ? {
                                  ...tx,
                                  description: vars.payload.description,
                                  amount: Number(vars.payload.amount),
                                  type: vars.payload.type as any,
                                  categoryId: vars.payload.categoryId,
                                  date: vars.payload.date,
                                  isExtra: !!vars.payload.isExtra,
                              }
                            : tx,
                    );
                    return { ...oldData, data: updated };
                },
            );

            await Promise.all([
                queryClient.refetchQueries({
                    queryKey: ['balance'],
                }),
            ]);

            toast.success('Transaction updated successfully');

            setEditOpen(false);
            setSelected(null);
        },
        onError: (err: any) => {
            console.error(err);
            const errMsg =
                err?.response?.data?.message ??
                err?.message ??
                'Failed to update transaction';
            toast.error(errMsg);
        },
    });

    const handleSubmit: SubmitHandler<FormType> = async (data, event) => {
        event?.preventDefault();
        if (!selected) return;
        updateMutation.mutate({ id: selected.id, payload: data });
    };

    const handleConfirmDelete = () => {
        if (!selected) return;
        deleteMutation.mutate(selected.id);
    };

    const deleteMutation = useMutation({
        mutationKey: ['delete-transaction'],
        mutationFn: async (id: string) => deleteTransactionApi(id),
        onSuccess: async (_res, id) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['transactions', page],
                }),
                queryClient.refetchQueries({
                    queryKey: ['balance'],
                }),
            ]);

            removeTransaction(id);

            toast.success('Transaction deleted successfully');

            setDeleteOpen(false);
            setSelected(null);
        },
        onError: (err: any) => {
            console.error(err);
            const errMsg =
                err?.response?.data?.message ??
                err?.message ??
                'Failed to delete transaction';
            toast.error(errMsg);
        },
    });

    return {
        page,
        transactions: getTransactionsQuery?.data ?? defaultData,
        categories,
        getTransactions: getTransactionsQuery.refetch,
        isLoading: getTransactionsQuery.isFetching,
        handleNavigate,
        // view state/handlers
        selected,
        editOpen,
        deleteOpen,
        setEditOpen,
        setDeleteOpen,
        form,
        handleSubmit,
        openEdit,
        openDelete,
        handleConfirmDelete,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
