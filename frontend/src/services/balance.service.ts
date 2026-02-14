import { api } from '@/lib/axios';

import { GetBalanceReportQueryInterface } from '@/interfaces/balance/get-balance-report-query.interface';
import { GetBalanceReportResponseInterface } from '@/interfaces/balance/get-balance-report-response.interface';

export const getBalanceReport = async (
    query: GetBalanceReportQueryInterface,
): Promise<GetBalanceReportResponseInterface> => {
    return api
        .get<GetBalanceReportResponseInterface>('/balance', {
            params: query,
        })
        .then((res) => res.data);
};
