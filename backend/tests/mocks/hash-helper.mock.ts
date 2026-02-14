import { HashHelper } from '@/common/helpers/hash.helper';

export const mockHashHelper = {
    hash: jest.fn(),
    compare: jest.fn(),
} as unknown as jest.Mocked<HashHelper>;
