import Fastify from 'fastify';

import { setupErrorHandler } from '@/common/interceptors/error-handler.interceptor';
import { setupMiddleware } from './setup-middleware';
import { registerRoutes } from './routes';

export const buildApp = async () => {
    const fastify = Fastify({
        logger: {
            level: 'info',
            transport: {
                target: 'pino-pretty',
                options: { colorize: true },
            },
        },
        disableRequestLogging: true,
    });

    await setupMiddleware(fastify);
    setupErrorHandler(fastify);
    await fastify.register(registerRoutes);

    return fastify;
};
