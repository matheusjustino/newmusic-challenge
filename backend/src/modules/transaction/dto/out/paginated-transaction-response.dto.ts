import z from 'zod';

import { createPaginatedResponseSchema } from '@/common/dtos/paginated-response.dto';
import { TransactionResponseSchema } from './transaction.dto';

export const PaginatedTransactionResponseDTOSchema =
    createPaginatedResponseSchema(TransactionResponseSchema);

export type PaginatedTransactionResponseDTO = z.infer<
    typeof PaginatedTransactionResponseDTOSchema
>;
