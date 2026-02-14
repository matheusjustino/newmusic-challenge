import { FastifyInstance } from 'fastify';

import { authRoutes } from './routes/auth.route';
import { categoryRoutes } from './routes/category.route';
import { transactionRoutes } from './routes/transaction.route';
import { balanceRoutes } from './routes/balance.route';

export async function registerRoutes(app: FastifyInstance) {
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(categoryRoutes, { prefix: '/api/categories' });
    app.register(transactionRoutes, { prefix: '/api/transactions' });
    app.register(balanceRoutes, { prefix: '/api/balance' });
}
