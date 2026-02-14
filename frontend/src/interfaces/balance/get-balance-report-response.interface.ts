import { BalanceReportByCategoryInterface } from './balance-report-by-category.interface';
import { BalanceReportByTypeInterface } from './balance-report-by-type.interface';

export interface GetBalanceReportResponseInterface {
    balance: number;
    byCategory: BalanceReportByCategoryInterface[];
    byType: BalanceReportByTypeInterface[];
}
