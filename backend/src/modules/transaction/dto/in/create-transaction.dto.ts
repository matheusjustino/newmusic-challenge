import { z } from 'zod';

import { TransactionTypeEnum } from '@/infrastructure/database/entities/transaction.entity';

export const CreateTransactionDTOSchema = z
    .object({
        description: z.string(),
        amount: z.number().positive(),
        type: z.enum(TransactionTypeEnum.enumValues),
        categoryId: z.string(),
        date: z.coerce.date(),
        isExtra: z.boolean().default(false),
    })
    .strict();

export type CreateTransactionDTO = z.infer<typeof CreateTransactionDTOSchema>;
