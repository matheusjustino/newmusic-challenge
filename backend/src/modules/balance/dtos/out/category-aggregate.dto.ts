import { z } from 'zod';

export const CategoryAggregateSchema = z.object({
    categoryId: z.string().uuid('v4'),
    count: z.number().int().nonnegative(),
    amount: z.number().nonnegative(), // in Reais
});

export type CategoryAggregateDTO = z.infer<typeof CategoryAggregateSchema>;
