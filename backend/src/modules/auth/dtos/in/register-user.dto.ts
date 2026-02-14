import { z } from 'zod';

export const RegisterUserDTOSchema = z
    .object({
        name: z.string(),
        email: z.email(),
        password: z.string(),
    })
    .strict();

export type RegisterUserDTO = z.infer<typeof RegisterUserDTOSchema>;
