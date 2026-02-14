import { createUser } from '@/fixtures/user.fixture';
import { mockUserRepository } from '@/mocks/user-repository.mock';
import {
    LoginUseCase,
    LoginUseCaseConstants,
} from '@/modules/auth/use-cases/login.use-case';
import { mockHashHelper } from '@/mocks/hash-helper.mock';
import { mockJwtHelper } from '@/mocks/jwt-helper.mock';
import { CustomerError } from '@/common/errors/customer.error';

describe('LoginUseCase', () => {
    let useCase: LoginUseCase;
    const mocks = {
        user: createUser(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new LoginUseCase(
            mockUserRepository,
            mockHashHelper,
            mockJwtHelper,
        );
    });

    test('should perform login successfully', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(mocks.user);
        mockHashHelper.compare.mockResolvedValue(true);
        mockJwtHelper.generateToken.mockReturnValue('token');

        const result = await useCase.execute({
            email: 'test@example.com',
            password: 'password',
        });

        const expected = {
            id: mocks.user.id,
            email: mocks.user.email,
            token: 'token',
        };

        expect(result).toEqual(expected);
    });

    test('should throw an error when user not found', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(
            useCase.execute({
                email: 'test@example.com',
                password: 'password',
            }),
        ).rejects.toThrow(
            new CustomerError(LoginUseCaseConstants.USER_NOT_FOUND, 404),
        );
    });

    test('should throw an error when password is invalid', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(mocks.user);
        mockHashHelper.compare.mockResolvedValue(false);

        await expect(
            useCase.execute({
                email: 'test@example.com',
                password: 'password',
            }),
        ).rejects.toThrow(
            new CustomerError(LoginUseCaseConstants.INVALID_PASSWORD, 404),
        );
    });
});
