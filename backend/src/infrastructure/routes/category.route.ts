import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { container } from 'tsyringe';
import { z } from 'zod';

import { CreateCategoryDTOSchema } from '@/modules/category/dtos/in/create-category.dto';
import { CreateCategoryUseCase } from '@/modules/category/use-cases/create-category.use-case';
import { CategoryResponseSchema } from '@/modules/category/dtos/out/category.dto';
import { UpdateCategoryDTOSchema } from '@/modules/category/dtos/in/update-category.dto';

import { GetCategoriesUseCase } from '@/modules/category/use-cases/get-categories.use-case';
import { UpdateCategoriesUseCase } from '@/modules/category/use-cases/update-category.use-case';
import { DeleteCategoriesUseCase } from '@/modules/category/use-cases/delete-category.use-case';

export async function categoryRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .post('/', {
            schema: {
                body: CreateCategoryDTOSchema,
                tags: ['category'],
                description: 'Create new category',
                response: {
                    200: CategoryResponseSchema,
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(CreateCategoryUseCase);
                const result = await useCase.execute(
                    request.user.id,
                    request.body,
                );
                return reply.status(200).send(result);
            },
        })
        .get('/', {
            schema: {
                tags: ['category'],
                description: 'Get all categories',
                response: {
                    200: z.array(CategoryResponseSchema),
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(GetCategoriesUseCase);
                const result = await useCase.execute(request.user.id);
                return reply.status(200).send(result);
            },
        })
        .patch('/:id', {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
                body: UpdateCategoryDTOSchema,
                tags: ['category'],
                description: 'Update category',
                response: {
                    200: z.boolean(),
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(UpdateCategoriesUseCase);
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
                tags: ['category'],
                description: 'Delete category',
                response: {
                    200: z.boolean(),
                },
            },
            handler: async (request, reply) => {
                const useCase = container.resolve(DeleteCategoriesUseCase);
                const result = await useCase.execute(
                    request.user.id,
                    request.params.id,
                );
                return reply.status(200).send(result);
            },
        });
}
