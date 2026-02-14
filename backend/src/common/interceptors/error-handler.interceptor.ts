import { FastifyInstance } from 'fastify';
import { CustomerError } from '../errors/customer.error';

export const setupErrorHandler = (fastify: FastifyInstance) => {
    fastify.setErrorHandler((error: CustomerError, request, reply) => {
        request.log.error(
            {
                err: error,
                method: request.method,
                url: request.url,
                body: request.body,
                params: request.params,
                query: request.query,
            },
            'Unhandled error occurred',
        );

        const statusCode = error.code || 500;

        reply.status(statusCode).send({
            statusCode,
            message: error.message || 'Internal Server Error',
        });
    });
};
