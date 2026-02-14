import { faker } from '@faker-js/faker';

import { UserInterface } from '@/infrastructure/database/entities/user.entity';

export const createUser = (partial?: UserInterface): UserInterface => {
    return {
        id: partial?.id ?? faker.string.uuid(),
        email: partial?.email ?? faker.internet.email(),
        name: partial?.name ?? faker.person.firstName(),
        password: partial?.password ?? faker.internet.password(),
        createdAt: partial?.createdAt ?? faker.date.recent(),
        updatedAt: partial?.updatedAt ?? faker.date.recent(),
    };
};
