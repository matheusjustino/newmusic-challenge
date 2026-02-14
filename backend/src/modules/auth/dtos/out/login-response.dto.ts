import z from 'zod';

export const LoginResponseSchema = z.object({
    id: z.uuid('v4'),
    email: z.string(),
    token: z.string(),
});

export class LoginResponseDTO implements LoginResponseDTO {
    public readonly id: string;
    public readonly email: string;
    public readonly token: string;

    constructor(data: LoginResponseDTO) {
        this.id = data.id;
        this.email = data.email;
        this.token = data.token;
        Object.freeze(this);
    }
}
