import { z } from 'zod';

export const TypeAggregateSchema = z.object({
    type: z.string(),
    count: z.number().int().nonnegative(),
    amount: z.number().nonnegative(), // in Reais
});

export type TypeAggregateDTO = z.infer<typeof TypeAggregateSchema>;
