'use client';

import { useRef } from 'react';

import { useCategoryStore } from '@/stores/category.store';
import { useBalanceStore } from '@/stores/balance.store';

import { CategoryInterface } from '@/interfaces/categories/category.interface';
import { GetBalanceReportResponseInterface } from '@/interfaces/balance/get-balance-report-response.interface';

interface Props {
    initialCategories: CategoryInterface[];
    initialBalanceReport?: GetBalanceReportResponseInterface | null;
    children: React.ReactNode;
}

export const InitialDataProvider: React.FC<Props> = ({
    initialCategories,
    initialBalanceReport,
    children,
}) => {
    const setCategories = useCategoryStore((state) => state.setCategories);
    const setReport = useBalanceStore((state) => state.setReport);

    const hydrated = useRef(false);
    if (!hydrated.current) {
        setCategories(initialCategories);
        setReport(initialBalanceReport ?? null);
        hydrated.current = true;
    }

    return <>{children}</>;
};
