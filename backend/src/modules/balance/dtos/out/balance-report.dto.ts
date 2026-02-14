import { z } from 'zod';
import { CategoryAggregateSchema } from './category-aggregate.dto';
import { TypeAggregateSchema } from './type-aggregate.dto';

export const BalanceReportResponseSchema = z.object({
    balance: z.number(),
    byCategory: z.array(CategoryAggregateSchema),
    byType: z.array(TypeAggregateSchema),
});

export type BalanceReportResponseDTO = z.infer<
    typeof BalanceReportResponseSchema
>;
