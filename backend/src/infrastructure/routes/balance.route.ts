import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { container } from 'tsyringe';

import { GetBalanceReportDTOSchema } from '@/modules/balance/dtos/in/get-balance-report.dto';
import { BalanceReportResponseSchema } from '@/modules/balance/dtos/out/balance-report.dto';
import { GetBalanceReportUseCase } from '@/modules/balance/use-cases/get-balance-report.use-case';

export async function balanceRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/', {
        schema: {
            querystring: GetBalanceReportDTOSchema,
            tags: ['balance'],
            description:
                'Get balance aggregates (by category and type) for a date range up to 30 days',
            response: {
                200: BalanceReportResponseSchema,
            },
        },
        handler: async (request, reply) => {
            const useCase = container.resolve(GetBalanceReportUseCase);
            const result = await useCase.execute(
                request.user.id,
                request.query,
            );
            return reply.status(200).send(result);
        },
    });
}
