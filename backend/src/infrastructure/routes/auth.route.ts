import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { container } from 'tsyringe';

import { LoginDTOSchema } from '@/modules/auth/dtos/in/login.dto';
import { UserResponseSchema } from '@/modules/auth/dtos/out/user-dto';

import { LoginUseCase } from '@/modules/auth/use-cases/login.use-case';
import { RegisterUserDTOSchema } from '@/modules/auth/dtos/in/register-user.dto';
import { RegisterUserUseCase } from '@/modules/auth/use-cases/register-user.use-case';
import { LoginResponseSchema } from '@/modules/auth/dtos/out/login-response.dto';

export async function authRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .post(
            '/register',
            {
                schema: {
                    body: RegisterUserDTOSchema,
                    tags: ['auth'],
                    description: 'Create new user',
                    response: {
                        200: UserResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const useCase = container.resolve(RegisterUserUseCase);

                const result = await useCase.execute(request.body);
                return reply.send(result);
            },
        )
        .post(
            '/login',
            {
                schema: {
                    body: LoginDTOSchema,
                    tags: ['auth'],
                    description: 'Login user',
                    response: {
                        200: LoginResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const useCase = container.resolve(LoginUseCase);
                const result = await useCase.execute(request.body);
                return reply.status(200).send(result);
            },
        );
}
