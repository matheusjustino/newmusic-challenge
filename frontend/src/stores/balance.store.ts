import { create } from 'zustand';
import { GetBalanceReportResponseInterface } from '@/interfaces/balance/get-balance-report-response.interface';

interface BalanceState extends Partial<GetBalanceReportResponseInterface> {
    setReport: (report: GetBalanceReportResponseInterface | null) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
    balance: undefined,
    byCategory: undefined,
    byType: undefined,
    setReport: (report) => {
        if (!report) {
            set({ balance: undefined, byCategory: undefined, byType: undefined });
            return;
        }
        set({
            balance: report.balance,
            byCategory: report.byCategory,
            byType: report.byType,
        });
    },
}));
