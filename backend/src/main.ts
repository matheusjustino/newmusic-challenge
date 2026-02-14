import 'reflect-metadata';
import 'dotenv/config';
import { container } from 'tsyringe';

import { DatabaseConnection } from '@/infrastructure/database/connection';
import { logger } from '@/common/logger';
import { buildApp } from '@/infrastructure/server';

async function bootstrap() {
    try {
        const PORT = Number(process.env.PORT || 8080);
        const app = await buildApp();

        const db = container.resolve(DatabaseConnection);
        await db.checkConnection();

        logger.info('Database connected successfully');

        await app.listen({
            port: PORT,
            host: '0.0.0.0',
        });

        logger.info('Server started successfully');
    } catch (e) {
        logger.error('Failed to start application');
        logger.error(e);
        process.exit(1);
    }
}

bootstrap();
