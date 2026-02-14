import { z } from 'zod';

export const LoginDTOSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export type LoginDTO = z.infer<typeof LoginDTOSchema>;
