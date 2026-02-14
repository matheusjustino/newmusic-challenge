"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_fixture_1 = require("@/fixtures/user.fixture");
const user_repository_mock_1 = require("@/mocks/user-repository.mock");
const login_use_case_1 = require("@/modules/auth/use-cases/login.use-case");
const hash_helper_mock_1 = require("@/mocks/hash-helper.mock");
const jwt_helper_mock_1 = require("@/mocks/jwt-helper.mock");
const customer_error_1 = require("@/common/errors/customer.error");
describe('LoginUseCase', () => {
    let useCase;
    const mocks = {
        user: (0, user_fixture_1.createUser)(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new login_use_case_1.LoginUseCase(user_repository_mock_1.mockUserRepository, hash_helper_mock_1.mockHashHelper, jwt_helper_mock_1.mockJwtHelper);
    });
    test('should perform login successfully', async () => {
        user_repository_mock_1.mockUserRepository.findByEmail.mockResolvedValue(mocks.user);
        hash_helper_mock_1.mockHashHelper.compare.mockResolvedValue(true);
        jwt_helper_mock_1.mockJwtHelper.generateToken.mockReturnValue('token');
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
        user_repository_mock_1.mockUserRepository.findByEmail.mockResolvedValue(null);
        await expect(useCase.execute({
            email: 'test@example.com',
            password: 'password',
        })).rejects.toThrow(new customer_error_1.CustomerError(login_use_case_1.LoginUseCaseConstants.USER_NOT_FOUND, 404));
    });
    test('should throw an error when password is invalid', async () => {
        user_repository_mock_1.mockUserRepository.findByEmail.mockResolvedValue(mocks.user);
        hash_helper_mock_1.mockHashHelper.compare.mockResolvedValue(false);
        await expect(useCase.execute({
            email: 'test@example.com',
            password: 'password',
        })).rejects.toThrow(new customer_error_1.CustomerError(login_use_case_1.LoginUseCaseConstants.INVALID_PASSWORD, 404));
    });
});
