import { z } from 'zod';

import {
    TransactionInterface,
    TransactionType,
    TransactionTypeEnum,
} from '@/infrastructure/database/entities/transaction.entity';

export const TransactionResponseSchema = z.object({
    id: z.uuid('v4'),
    description: z.string(),
    amount: z.number(),
    type: z.enum(TransactionTypeEnum.enumValues),
    date: z.date(),
    isExtra: z.boolean().default(false),
    userId: z.uuid('v4'),
    categoryId: z.uuid('v4'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type TransactionResponseDTO = z.infer<typeof TransactionResponseSchema>;

export class TransactionDTO implements TransactionResponseDTO {
    public readonly id: string;
    public readonly description: string;
    public readonly amount: number;
    public readonly type: TransactionType;
    public readonly date: Date;
    public readonly isExtra: boolean;
    public readonly userId: string;
    public readonly categoryId: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(transaction: TransactionInterface) {
        this.id = transaction.id;
        this.userId = transaction.userId;
        this.categoryId = transaction.categoryId;
        this.type = transaction.type;
        this.amount = transaction.amount / 100; // convert to Reais
        this.date = transaction.date;
        this.description = transaction.description;
        this.isExtra = transaction.isExtra;
        this.createdAt = transaction.createdAt;
        this.updatedAt = transaction.updatedAt;
    }
}
