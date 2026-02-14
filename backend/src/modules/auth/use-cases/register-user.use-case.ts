import { inject, injectable } from 'tsyringe';

import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { HashHelper } from '@/common/helpers/hash.helper';
import { CustomerError } from '@/common/errors/customer.error';
import { RegisterUserDTO } from '../dtos/in/register-user.dto';
import { UserDTO } from '../dtos/out/user-dto';

const constants = {
    USER_ALREADY_EXISTS: 'User already exists',
};

@injectable()
export class RegisterUserUseCase {
    constructor(
        @inject(UserRepository.name)
        private readonly userRepository: UserRepository,
        @inject(HashHelper.name)
        private readonly hashHelper: HashHelper,
    ) {}

    public async execute(data: RegisterUserDTO): Promise<UserDTO> {
        const userExists = await this.userRepository.findByEmail(data.email);
        if (userExists) {
            throw new CustomerError(constants.USER_ALREADY_EXISTS, 400);
        }

        const passwordHash = await this.hashHelper.hash(data.password);
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: passwordHash,
        });

        return new UserDTO(user);
    }
}

export { constants as RegisterUserUseCaseConstants };
