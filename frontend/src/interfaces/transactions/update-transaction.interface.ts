import { TransactionTypeEnum } from '@/enums/transaction-type.enum';

export interface UpdateTransactionInterface {
    name?: string;
    description?: string;
    amount?: number;
    type?: TransactionTypeEnum;
    categoryId?: string;
    date?: Date;
    isExtra?: boolean;
}
