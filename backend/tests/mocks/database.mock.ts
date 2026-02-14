import { DatabaseConnection } from '@/infrastructure/database/connection';

export const mockDatabase = {
    db: jest.fn(),
} as unknown as jest.Mocked<DatabaseConnection>;
