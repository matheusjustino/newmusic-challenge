import { inject, injectable } from 'tsyringe';

import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { HashHelper } from '@/common/helpers/hash.helper';
import { JwtHelper } from '@/common/helpers/jwt.helper';
import { LoginDTO } from '../dtos/in/login.dto';
import { CustomerError } from '@/common/errors/customer.error';
import { LoginResponseDTO } from '../dtos/out/login-response.dto';

const constants = {
    USER_NOT_FOUND: 'User not found',
    INVALID_PASSWORD: 'Invalid password',
};

@injectable()
export class LoginUseCase {
    constructor(
        @inject(UserRepository.name)
        private readonly userRepository: UserRepository,
        @inject(HashHelper.name)
        private readonly hashHelper: HashHelper,
        @inject(JwtHelper.name)
        private readonly jwtHelper: JwtHelper,
    ) {}

    public async execute(data: LoginDTO): Promise<LoginResponseDTO> {
        const userExists = await this.userRepository.findByEmail(data.email);
        if (!userExists) {
            throw new CustomerError(constants.USER_NOT_FOUND, 404);
        }

        const passwordMatch = await this.hashHelper.compare(
            data.password,
            userExists.password,
        );

        if (!passwordMatch) {
            throw new CustomerError(constants.INVALID_PASSWORD, 401);
        }

        const token = this.jwtHelper.generateToken({
            id: userExists.id,
            email: userExists.email,
        });

        return new LoginResponseDTO({
            id: userExists.id,
            email: userExists.email,
            token,
        });
    }
}

export { constants as LoginUseCaseConstants };
