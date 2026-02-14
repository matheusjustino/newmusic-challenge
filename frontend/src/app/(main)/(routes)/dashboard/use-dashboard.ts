'use client';

import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useQuery } from '@tanstack/react-query';

import { useBalanceStore } from '@/stores/balance.store';
import { useCategoryStore } from '@/stores/category.store';
import { getBalanceReport } from '@/services/balance.service';
import { GetBalanceReportResponseInterface } from '@/interfaces/balance/get-balance-report-response.interface';

function formatBR(d: Date) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function getDefaultRange(): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return { from: start, to: end };
}

export function useDashboard() {
    const storeBalance = useBalanceStore((s) => s.balance);
    const storeByCategory = useBalanceStore((s) => s.byCategory);
    const storeByType = useBalanceStore((s) => s.byType);
    const categories = useCategoryStore((s) => s.categories);

    const [range, setRange] = useState<DateRange>(getDefaultRange());

    const startDate = useMemo(
        () => (range?.from ? formatBR(range.from) : undefined),
        [range?.from],
    );
    const endDate = useMemo(
        () => (range?.to ? formatBR(range.to) : undefined),
        [range?.to],
    );

    const { data } = useQuery<GetBalanceReportResponseInterface>({
        queryKey: ['balance', startDate, endDate],
        queryFn: () =>
            getBalanceReport({
                startDate: startDate!,
                endDate: endDate!,
            }),
        enabled: Boolean(startDate && endDate),
    });

    const getCategoryName = (id: string) =>
        categories?.find((c) => c.id === id)?.name ?? id;

    const byCategory = data?.byCategory ?? storeByCategory ?? [];
    const categoryChartData = useMemo(
        () =>
            byCategory.map((c) => ({
                category: getCategoryName(c.categoryId),
                totalAmount: c.amount,
                totalTransactions: c.count,
            })),
        [byCategory, categories],
    );

    const byType = data?.byType ?? storeByType ?? [];
    const income = byType.find((t) => t.type === 'income')?.amount ?? 0;
    const expense = byType.find((t) => t.type === 'expense')?.amount ?? 0;

    const typeChartData = useMemo(
        () =>
            byType.map((t) => ({
                type: t.type === 'expense' ? 'Expenses' : 'Income',
                totalAmount: t.amount,
                totalTransactions: t.count,
            })),
        [byType],
    );

    const isSameDate = (a?: Date, b?: Date) =>
        Boolean(a) && Boolean(b) && a!.getTime() === b!.getTime();

    const onRangeChange = (r: DateRange) => {
        if (!r?.from || !r?.to) return;
        const sameFrom = isSameDate(r.from, range?.from);
        const sameTo = isSameDate(r.to, range?.to);
        if (sameFrom && sameTo) return;
        setRange(r);
    };

    return {
        // ui data
        balance: data?.balance ?? storeBalance ?? 0,
        income,
        expense,
        categoryChartData,
        typeChartData,
        // range control
        range,
        onRangeChange: onRangeChange,
    };
}
