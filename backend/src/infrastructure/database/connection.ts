import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { singleton } from 'tsyringe';

import { schema } from './entities';

@singleton()
export class DatabaseConnection {
    private pool: Pool;
    public db;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            connectionTimeoutMillis: 5000,
        });

        this.db = drizzle(this.pool, { schema });
    }

    async checkConnection(): Promise<void> {
        await this.pool.query('SELECT 1');
    }
}
