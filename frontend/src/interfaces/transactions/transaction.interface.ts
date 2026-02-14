import { TransactionTypeEnum } from '@/enums/transaction-type.enum';

export interface TransactionInterface {
    id: string;
    description: string;
    amount: number;
    type: TransactionTypeEnum;
    date: string;
    isExtra: boolean;
    userId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}
