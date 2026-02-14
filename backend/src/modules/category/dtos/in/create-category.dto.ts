import { z } from 'zod';

export const CreateCategoryDTOSchema = z
    .object({
        name: z.string(),
        description: z.string(),
    })
    .strict();

export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTOSchema>;
