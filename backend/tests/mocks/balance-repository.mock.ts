import { BalanceRepository } from '@/infrastructure/database/repositories/balance.repository';

export const mockBalanceRepository = {
    getAggregatesByCategory: jest.fn(),
    getAggregatesByType: jest.fn(),
} as unknown as jest.Mocked<BalanceRepository>;
