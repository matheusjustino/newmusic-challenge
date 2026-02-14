import { TransactionTypeEnum } from '@/enums/transaction-type.enum';

export interface BalanceReportByTypeInterface {
    type: TransactionTypeEnum;
    count: number;
    amount: number;
}
