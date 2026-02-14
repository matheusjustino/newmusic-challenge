import { z } from 'zod';

export const UpdateCategoryDTOSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
});

export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTOSchema>;
