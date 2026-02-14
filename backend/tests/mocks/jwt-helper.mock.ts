import { JwtHelper } from '@/common/helpers/jwt.helper';

export const mockJwtHelper = {
    generateToken: jest.fn(),
} as unknown as jest.Mocked<JwtHelper>;
