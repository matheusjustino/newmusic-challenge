import { inject, injectable } from 'tsyringe';
import { and, eq, desc, sql } from 'drizzle-orm';

import { DatabaseConnection } from '@/infrastructure/database/connection';
import { CreateTransactionDTO } from '@/modules/transaction/dto/in/create-transaction.dto';
import {
    TransactionEntity,
    TransactionInterface,
} from '../entities/transaction.entity';
import { UpdateTransactionDTO } from '@/modules/transaction/dto/in/update-transaction.dto';
import { PaginationDTO } from '@/common/dtos/pagination.dto';

@injectable()
export class TransactionRepository {
    constructor(
        @inject(DatabaseConnection)
        private readonly database: DatabaseConnection,
    ) {}

    async create(
        userId: string,
        data: CreateTransactionDTO,
    ): Promise<TransactionInterface> {
        const [transaction] = await this.database.db
            .insert(TransactionEntity)
            .values({
                userId,
                ...data,
            })
            .returning();

        return transaction;
    }

    async getTransactionsByUserId(
        userId: string,
        pagination: PaginationDTO,
    ): Promise<{ data: TransactionInterface[]; totalItems: number }> {
        const { perPage, page } = pagination;
        const offset = page * perPage;

        const result = await this.database.db
            .select({
                id: TransactionEntity.id,
                amount: TransactionEntity.amount,
                description: TransactionEntity.description,
                type: TransactionEntity.type,
                date: TransactionEntity.date,
                isExtra: TransactionEntity.isExtra,
                userId: TransactionEntity.userId,
                categoryId: TransactionEntity.categoryId,
                createdAt: TransactionEntity.createdAt,
                updatedAt: TransactionEntity.updatedAt,
                // adiciona o total de registros como uma coluna extra
                totalCount: sql<number>`count(*) over()`.as('total_count'),
            })
            .from(TransactionEntity)
            .where(eq(TransactionEntity.userId, userId))
            .limit(perPage)
            .offset(offset)
            .orderBy(desc(TransactionEntity.createdAt));

        const totalItems = result.length > 0 ? Number(result[0].totalCount) : 0;
        const data = result.map(({ totalCount, ...transaction }) => ({
            ...transaction,
            amount: transaction.amount / 100,
        }));

        return { data, totalItems };
    }

    async getTransactionByUserId(
        userId: string,
        transactionId: string,
    ): Promise<TransactionInterface | null> {
        const transaction = await this.database.db.query.Transaction.findFirst({
            where: and(
                eq(TransactionEntity.id, transactionId),
                eq(TransactionEntity.userId, userId),
            ),
        });
        return transaction ?? null;
    }

    async updateTransactionByUserId(
        userId: string,
        transactionId: string,
        data: UpdateTransactionDTO,
    ): Promise<boolean> {
        const res = await this.database.db
            .update(TransactionEntity)
            .set(data)
            .where(
                and(
                    eq(TransactionEntity.id, transactionId),
                    eq(TransactionEntity.userId, userId),
                ),
            );
        return res.rowCount !== null && res.rowCount > 0;
    }

    async deleteTransactionByUserId(
        userId: string,
        transactionId: string,
    ): Promise<boolean> {
        const res = await this.database.db
            .delete(TransactionEntity)
            .where(
                and(
                    eq(TransactionEntity.id, transactionId),
                    eq(TransactionEntity.userId, userId),
                ),
            );
        return res.rowCount !== null && res.rowCount > 0;
    }
}
