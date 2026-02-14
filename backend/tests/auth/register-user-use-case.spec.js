"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customer_error_1 = require("@/common/errors/customer.error");
const user_fixture_1 = require("@/fixtures/user.fixture");
const hash_helper_mock_1 = require("@/mocks/hash-helper.mock");
const user_repository_mock_1 = require("@/mocks/user-repository.mock");
const user_dto_1 = require("@/modules/auth/dtos/out/user-dto");
const register_user_use_case_1 = require("@/modules/auth/use-cases/register-user.use-case");
describe('RegisterUserUseCase', () => {
    let useCase;
    const mocks = {
        user: (0, user_fixture_1.createUser)(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new register_user_use_case_1.RegisterUserUseCase(user_repository_mock_1.mockUserRepository, hash_helper_mock_1.mockHashHelper);
    });
    test('should return a new user successfully', async () => {
        user_repository_mock_1.mockUserRepository.findByEmail.mockResolvedValueOnce(null);
        hash_helper_mock_1.mockHashHelper.hash.mockResolvedValueOnce('hash');
        user_repository_mock_1.mockUserRepository.create.mockResolvedValueOnce(mocks.user);
        const result = await useCase.execute({
            name: 'name',
            email: 'email',
            password: 'password',
        });
        const expected = new user_dto_1.UserDTO(mocks.user);
        expect(result).toBeInstanceOf(user_dto_1.UserDTO);
        expect(result).toEqual(expected);
    });
    test('should throw an error when email already used', async () => {
        user_repository_mock_1.mockUserRepository.findByEmail.mockResolvedValueOnce(mocks.user);
        await expect(useCase.execute({
            name: 'name',
            email: 'email',
            password: 'password',
        })).rejects.toThrow(new customer_error_1.CustomerError(register_user_use_case_1.RegisterUserUseCaseConstants.USER_ALREADY_EXISTS, 400));
    });
});
