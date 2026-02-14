import { CustomerError } from '@/common/errors/customer.error';
import { createUser } from '@/fixtures/user.fixture';
import { mockHashHelper } from '@/mocks/hash-helper.mock';
import { mockUserRepository } from '@/mocks/user-repository.mock';
import { UserDTO } from '@/modules/auth/dtos/out/user-dto';
import {
    RegisterUserUseCase,
    RegisterUserUseCaseConstants,
} from '@/modules/auth/use-cases/register-user.use-case';

describe('RegisterUserUseCase', () => {
    let useCase: RegisterUserUseCase;
    const mocks = {
        user: createUser(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new RegisterUserUseCase(mockUserRepository, mockHashHelper);
    });

    test('should return a new user successfully', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);
        mockHashHelper.hash.mockResolvedValueOnce('hash');
        mockUserRepository.create.mockResolvedValueOnce(mocks.user);

        const result = await useCase.execute({
            name: 'name',
            email: 'email',
            password: 'password',
        });

        const expected = new UserDTO(mocks.user);

        expect(result).toBeInstanceOf(UserDTO);
        expect(result).toEqual(expected);
    });

    test('should throw an error when email already used', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(mocks.user);

        await expect(
            useCase.execute({
                name: 'name',
                email: 'email',
                password: 'password',
            }),
        ).rejects.toThrow(
            new CustomerError(
                RegisterUserUseCaseConstants.USER_ALREADY_EXISTS,
                400,
            ),
        );
    });
});
