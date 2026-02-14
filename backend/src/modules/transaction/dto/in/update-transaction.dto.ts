import { z } from 'zod';

import { TransactionTypeEnum } from '@/infrastructure/database/entities/transaction.entity';

export const UpdateTransactionDTOSchema = z
    .object({
        name: z.string().optional(),
        description: z.string().optional(),
        amount: z.number().optional(),
        type: z.enum(TransactionTypeEnum.enumValues).optional(),
        categoryId: z.string().optional(),
        date: z.coerce.date().optional(),
        isExtra: z.boolean().optional(),
    })
    .strict();

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionDTOSchema>;
