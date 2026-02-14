import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { container } from 'tsyringe';
import { z } from 'zod';

import { CreateTransactionDTOSchema } from '@/modules/transaction/dto/in/create-transaction.dto';
import { TransactionResponseSchema } from '@/modules/transaction/dto/out/transaction.dto';
import { GetTransactionsUseCase } from '@/modules/transaction/use-cases/get-transactions.use-case';
import { CreateTransactionUseCase } from '@/modules/transaction/use-cases/create-transactions.use-case';
import { UpdateTransactionUseCase } from '@/modules/transaction/use-cases/update-transaction.use-case';
import { UpdateTransactionDTOSchema } from '@/modules/transaction/dto/in/update-transaction.dto';
import { DeleteTransactionUseCase } from '@/modules/transaction/use-cases/delete-transaction.use-case';
import { PaginationDTOSchema } from '@/common/dtos/pagination.dto';
import { PaginatedTransactionResponseDTOSchema } from '@/modules/transaction/dto/out/paginated-transaction-response.dto';

export async function transactionRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .post('/', {
            schema: {
                body: CreateTransactionDTOSchema,
                tags: ['transaction'],
                description: 'Create new transaction',
                response: {
                    200: TransactionResponseSchema,
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(CreateTransactionUseCase);
                const result = await useCase.execute(
                    request.user.id,
                    request.body,
                );
                return reply.status(200).send(result);
            },
        })
        .get('/', {
            schema: {
                querystring: PaginationDTOSchema,
                tags: ['transaction'],
                description: 'Get all transactions',
                response: {
                    200: PaginatedTransactionResponseDTOSchema,
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(GetTransactionsUseCase);
                const result = await useCase.execute(
                    request.user.id,
                    request.query,
                );
                return reply.status(200).send(result);
            },
        })
        .patch('/:id', {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
                body: UpdateTransactionDTOSchema,
                tags: ['transaction'],
                description: 'Update transaction',
                response: {
                    200: z.boolean(),
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(UpdateTransactionUseCase);
                const result = await useCase.execute(
                    request.user.id,
                    request.params.id,
                    request.body,
                );
                return reply.status(200).send(result);
            },
        })
        .delete('/:id', {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
                tags: ['transaction'],
                description: 'Delete transaction',
                response: {
                    200: z.boolean(),
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(DeleteTransactionUseCase);
                const result = await useCase.execute(
                    request.user.id,
                    request.params.id,
                );
                return reply.status(200).send(result);
            },
        });
}
