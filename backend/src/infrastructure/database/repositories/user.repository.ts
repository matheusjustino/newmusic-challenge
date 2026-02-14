import { inject, injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@/infrastructure/database/connection';
import {
    UserEntity,
    UserInterface,
} from '@/infrastructure/database/entities/user.entity';
import { RegisterUserDTO } from '@/modules/auth/dtos/in/register-user.dto';

@injectable()
export class UserRepository {
    constructor(
        @inject(DatabaseConnection)
        private readonly database: DatabaseConnection,
    ) {}

    async create(data: RegisterUserDTO): Promise<UserInterface> {
        const [user] = await this.database.db
            .insert(UserEntity)
            .values(data)
            .returning();

        return user;
    }

    async findByEmail(email: string): Promise<UserInterface | null> {
        const user = await this.database.db.query.User.findFirst({
            where: eq(UserEntity.email, email),
        });

        return user ?? null;
    }

    async findById(id: string): Promise<UserInterface | null> {
        const user = await this.database.db.query.User.findFirst({
            where: eq(UserEntity.id, id),
        });

        return user ?? null;
    }
}
