import { inject, injectable } from 'tsyringe';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

import { DatabaseConnection } from '@/infrastructure/database/connection';
import { TransactionEntity } from '@/infrastructure/database/entities/transaction.entity';

export interface CategoryAggregate {
    categoryId: string;
    count: number;
    amount: number; // in cents
}

export interface TypeAggregate {
    type: string;
    count: number;
    amount: number; // in cents
}

@injectable()
export class BalanceRepository {
    constructor(
        @inject(DatabaseConnection)
        private readonly database: DatabaseConnection,
    ) {}

    async getAggregatesByCategory(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<CategoryAggregate[]> {
        const rows = await this.database.db
            .select({
                categoryId: TransactionEntity.categoryId,
                count: sql<number>`count(*)`.as('count'),
                amount: sql<number>`sum(${TransactionEntity.amount})`.as(
                    'amount',
                ),
            })
            .from(TransactionEntity)
            .where(
                and(
                    eq(TransactionEntity.userId, userId),
                    eq(TransactionEntity.type, 'expense'),
                    gte(TransactionEntity.date, startDate),
                    lte(TransactionEntity.date, endDate),
                ),
            )
            .groupBy(TransactionEntity.categoryId);

        return rows.map((r) => ({
            categoryId: r.categoryId,
            count: Number(r.count ?? 0),
            amount: Number(r.amount ?? 0),
        }));
    }

    async getAggregatesByType(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<TypeAggregate[]> {
        const rows = await this.database.db
            .select({
                type: TransactionEntity.type,
                count: sql<number>`count(*)`.as('count'),
                amount: sql<number>`sum(${TransactionEntity.amount})`.as(
                    'amount',
                ),
            })
            .from(TransactionEntity)
            .where(
                and(
                    eq(TransactionEntity.userId, userId),
                    gte(TransactionEntity.date, startDate),
                    lte(TransactionEntity.date, endDate),
                ),
            )
            .groupBy(TransactionEntity.type);

        return rows.map((r) => ({
            type: r.type,
            count: Number(r.count ?? 0),
            amount: Number(r.amount ?? 0),
        }));
    }
}
