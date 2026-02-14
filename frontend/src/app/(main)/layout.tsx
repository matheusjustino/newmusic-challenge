import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getAuthSession } from '@/lib/nextauth';
import { queryClient } from '@/lib/query-client';

// PROVIDERS
import { SidebarProvider } from '@/providers/sidebar.provider';
import { InitialDataProvider } from '@/providers/initial-data.provider';

// SERVICES
import { getCategories } from '@/services/category.service';
import { getTransactions } from '@/services/transaction.service';
import { CategoryInterface } from '@/interfaces/categories/category.interface';
import { getBalanceReport } from '@/services/balance.service';
import { GetBalanceReportResponseInterface } from '@/interfaces/balance/get-balance-report-response.interface';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getAuthSession();
    if (!session?.user) redirect('/sign-in');

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const fmt = (d: Date) => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };
    const startDate = fmt(start);
    const endDate = fmt(end);

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['categories'],
            queryFn: getCategories,
        }),
        queryClient.prefetchQuery({
            queryKey: ['transactions', 1],
            queryFn: () => getTransactions({ page: 0, limit: 10 }),
        }),
        queryClient.prefetchQuery({
            queryKey: ['balance', startDate, endDate],
            queryFn: () =>
                getBalanceReport({
                    startDate,
                    endDate,
                }),
        }),
    ]);
    const categories = queryClient.getQueryData<CategoryInterface[]>([
        'categories',
    ]);
    const balanceReport =
        queryClient.getQueryData<GetBalanceReportResponseInterface>([
            'balance',
            startDate,
            endDate,
        ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SidebarProvider>
                <InitialDataProvider
                    initialCategories={categories ?? []}
                    initialBalanceReport={balanceReport ?? null}
                >
                    <div className="p-4">{children}</div>
                </InitialDataProvider>
            </SidebarProvider>
        </HydrationBoundary>
    );
}
