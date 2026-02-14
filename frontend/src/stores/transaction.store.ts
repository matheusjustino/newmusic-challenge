import { create } from 'zustand';

import { TransactionInterface } from '@/interfaces/transactions/transaction.interface';
import { GetTransactionsResponseInterface } from '@/interfaces/transactions/get-transactions-response.interface';

interface TransactionState {
    transactions: GetTransactionsResponseInterface;
    setTransactions: (transactions: GetTransactionsResponseInterface) => void;
    addTransaction: (transaction: TransactionInterface) => void;
    updateTransaction: (
        id: string,
        data: Partial<TransactionInterface>,
    ) => void;
    removeTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: {
        data: [],
        meta: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 0,
            itemsPerPage: 0,
        },
    },
    setTransactions: (transactions) => set({ transactions }),
    addTransaction: (transaction) =>
        set((state) => ({
            transactions: {
                data: [...state.transactions.data, transaction],
                meta: {
                    ...state.transactions.meta,
                    totalItems: state.transactions.meta.totalItems + 1,
                    totalPages: Math.ceil(
                        (state.transactions.meta.totalItems + 1) /
                            state.transactions.meta.itemsPerPage,
                    ),
                },
            },
        })),
    updateTransaction: (id, data) =>
        set((state) => ({
            transactions: {
                data: state.transactions.data.map((transaction) =>
                    transaction.id === id
                        ? { ...transaction, ...data }
                        : transaction,
                ),
                meta: state.transactions.meta,
            },
        })),
    removeTransaction: (id) =>
        set((state) => {
            const txIndex = state.transactions.data.findIndex(
                (tx) => tx.id === id,
            );
            if (txIndex === -1) return state;

            state.transactions.data.splice(txIndex, 1);
            return {
                transactions: {
                    data: state.transactions.data,
                    meta: {
                        ...state.transactions.meta,
                        totalItems: state.transactions.meta.totalItems - 1,
                        totalPages: Math.ceil(
                            state.transactions.meta.totalItems /
                                state.transactions.meta.itemsPerPage,
                        ),
                    },
                },
            };
        }),
}));
