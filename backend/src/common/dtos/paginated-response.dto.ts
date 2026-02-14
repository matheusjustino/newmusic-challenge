import z from 'zod';

export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(
    itemSchema: T,
) {
    return z.object({
        data: z.array(itemSchema),
        meta: z.object({
            totalItems: z.number().int().nonnegative(),
            totalPages: z.number().int().nonnegative(),
            currentPage: z.number().int().nonnegative(),
            itemsPerPage: z.number().int().positive(),
        }),
    });
}
