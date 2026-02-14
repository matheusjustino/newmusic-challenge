import { api } from '@/lib/axios';

import { CreateTransactionInterface } from '@/interfaces/transactions/create-transaction.interface';
import { TransactionInterface } from '@/interfaces/transactions/transaction.interface';
import { GetTransactionsResponseInterface } from '@/interfaces/transactions/get-transactions-response.interface';
import { GetTransactionsQueryInterface } from '@/interfaces/transactions/get-transactions-query.interface';
import { UpdateTransactionInterface } from '@/interfaces/transactions/update-transaction.interface';

export const createTransaction = async (
    payload: CreateTransactionInterface,
) => {
    return api
        .post<TransactionInterface>('/transactions', payload)
        .then((res) => res.data);
};

export const getTransactions = async (
    query: GetTransactionsQueryInterface = { page: 0, limit: 10 },
) => {
    return api
        .get<GetTransactionsResponseInterface>('/transactions', {
            params: query,
        })
        .then((res) => res.data);
};

export const updateTransaction = async (
    id: string,
    payload: UpdateTransactionInterface,
) => {
    return api
        .patch<TransactionInterface>(`/transactions/${id}`, payload)
        .then((res) => res.data);
};

export const deleteTransaction = async (id: string) => {
    return api
        .delete<TransactionInterface>(`/transactions/${id}`)
        .then((res) => res.data);
};
