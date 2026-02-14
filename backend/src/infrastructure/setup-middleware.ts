import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import cookie from '@fastify/cookie';
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';

import containerPlugin from '@/infrastructure/di/container';
import jwtPlugin from '@/infrastructure/jwt';
import { jwtGuard } from '@/common/guards/jwt.guard';

export const setupMiddleware = async (fastify: FastifyInstance) => {
    const allowedOrigins = process.env.ORIGIN_URLS
        ? process.env.ORIGIN_URLS.split(',').map((origin) => origin.trim())
        : true;

    await fastify.register(cors, {
        // When credentials are enabled, wildcard '*' is not allowed by CORS spec.
        // Use explicit origins (from env) or true to reflect the request origin.
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await fastify.register(helmet);
    await fastify.register(cookie);
    await fastify.register(compress);
    await fastify.register(containerPlugin);
    await fastify.register(jwtPlugin);
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

    // Custom "middleware"
    fastify.addHook('onRequest', async (request, reply) => {
        if (!request.url.startsWith('/api/auth')) {
            await jwtGuard(request, reply);
        }
    });

    fastify.addHook('onRequest', async (request, reply) => {
        request.log = request.log.child({ requestId: request.id });
        request.log.info(
            {
                method: request.method,
                url: request.url,
                headers: request.headers,
                ip: request.ip,
            },
            'Incoming request',
        );
    });

    fastify.addHook('onResponse', async (request, reply) => {
        request.log.info(
            {
                method: request.method,
                url: request.url,
                statusCode: reply.statusCode,
                responseTime: reply.elapsedTime,
            },
            'Request completed',
        );
    });
};
