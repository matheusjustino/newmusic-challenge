import { TransactionTypeEnum } from '@/enums/transaction-type.enum';

export interface CreateTransactionInterface {
    description: string;
    amount: number;
    type: TransactionTypeEnum;
    categoryId: string;
    date: string;
    isExtra: boolean;
}
