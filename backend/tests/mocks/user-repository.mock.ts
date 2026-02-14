import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { mockDatabase } from './database.mock';

export const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    database: mockDatabase,
} as unknown as jest.Mocked<UserRepository>;

jest.mock('@/infrastructure/database/repositories/user.repository', () => ({
    UserRepository: jest.fn().mockImplementation(() => mockUserRepository),
}));
