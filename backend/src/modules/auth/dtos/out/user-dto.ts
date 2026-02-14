import { z } from 'zod';

import { UserInterface } from '@/infrastructure/database/entities/user.entity';

export const UserResponseSchema = z.object({
    id: z.uuid('v4'),
    name: z.string(),
    email: z.email(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type UserResponseDTO = z.infer<typeof UserResponseSchema>;

export class UserDTO implements UserResponseDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly email: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(user: UserInterface) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        Object.freeze(this);
    }
}
