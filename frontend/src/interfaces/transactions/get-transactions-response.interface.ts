import { TransactionInterface } from './transaction.interface';

export interface GetTransactionsResponseInterface {
    data: TransactionInterface[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
}
