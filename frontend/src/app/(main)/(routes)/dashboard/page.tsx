'use client';

import { NextPage } from 'next';

// UTILS
import { currencyFormatter } from '@/lib/utils';

import { useDashboard } from './use-dashboard';

// COMPONENTS
import { PieChart } from '../../_components/charts/pie-chart';
import { BarChart } from '../../_components/charts/bar-chart';
import BalanceCard from '../../_components/balance-card';
import { DateRangeFilter } from '../../_components/date-ranger-filter';

interface CategoryStats {
    category: string;
    totalAmount: number;
    totalTransactions: number;
}

interface TransactionStats {
    type: string;
    totalAmount: number;
    totalTransactions: number;
}

const DashboardPage: NextPage = () => {
    const {
        balance,
        income,
        expense,
        categoryChartData,
        typeChartData,
        onRangeChange,
    } = useDashboard();

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
                    {/* Balance Card */}
                    <div className="w-full md:w-full lg:order-1 order-2">
                        <BalanceCard
                            balance={balance ?? 0}
                            income={income}
                            expense={expense}
                        />
                    </div>

                    {/* Date Range */}
                    <div
                        className="
                            right-0 top-0
                            md:static
                            flex justify-end
                            lg:order-2
                            order-1
                        "
                    >
                        <DateRangeFilter onChange={onRangeChange} />
                    </div>
                </div>

                {/* Pie Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                    <PieChart<CategoryStats>
                        data={categoryChartData}
                        getLabel={(item) => item.category}
                        getValue={(item) => item.totalAmount}
                        title="Amount by category"
                        transformValue={currencyFormatter().format}
                    />

                    <PieChart<CategoryStats>
                        data={categoryChartData}
                        getLabel={(item) => item.category}
                        getValue={(item) => item.totalTransactions}
                        title="Transactions by category"
                    />
                </div>

                {/* Bar Charts */}
                <div className="flex flex-col gap-6">
                    <BarChart<TransactionStats>
                        data={typeChartData}
                        getLabel={(item) => item.type}
                        getValue={(item) => item.totalTransactions}
                        title="Transactions per type"
                    />

                    <BarChart<TransactionStats>
                        data={typeChartData}
                        getLabel={(item) => item.type}
                        getValue={(item) => item.totalAmount}
                        title="Amount by type"
                        transformValue={currencyFormatter().format}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
