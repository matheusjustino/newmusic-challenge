'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface BalanceCardProps {
    balance: number;
    income?: number;
    expense?: number;
}

export default function BalanceCard({
    balance,
    income,
    expense,
}: BalanceCardProps) {
    const formattedBalance = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(balance);

    const formattedIncome = income
        ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
          }).format(income)
        : null;

    const formattedExpense = expense
        ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
          }).format(expense)
        : null;

    const isPositive = balance >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Card className="rounded-2xl shadow-md border bg-gradient-to-br from-background to-muted/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Saldo Atual
                    </CardTitle>
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">
                        {formattedBalance}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        {formattedIncome && (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <ArrowUpRight className="h-4 w-4" />
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Entradas
                                    </p>
                                    <p className="font-semibold">
                                        {formattedIncome}
                                    </p>
                                </div>
                            </div>
                        )}

                        {formattedExpense && (
                            <div className="flex items-center gap-2 text-red-500">
                                <ArrowDownRight className="h-4 w-4" />
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Saídas
                                    </p>
                                    <p className="font-semibold">
                                        {formattedExpense}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            isPositive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {isPositive ? 'Saldo Positivo' : 'Saldo Negativo'}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
