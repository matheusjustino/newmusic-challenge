import { z } from 'zod';

export const PaginationDTOSchema = z.object({
    perPage: z.string().transform(Number).default(10),
    page: z.string().transform(Number).default(0),
});

export type PaginationDTO = z.infer<typeof PaginationDTOSchema>;
