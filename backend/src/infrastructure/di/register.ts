import { container } from 'tsyringe';

import { DatabaseConnection } from '@/infrastructure/database/connection';
import { HashHelper } from '@/common/helpers/hash.helper';
import { JwtHelper } from '@/common/helpers/jwt.helper';
import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository';
import { BalanceRepository } from '@/infrastructure/database/repositories/balance.repository';

export function registerDependencies() {
    container.registerSingleton(DatabaseConnection);
    container.registerSingleton(HashHelper.name, HashHelper);
    container.registerSingleton(JwtHelper.name, JwtHelper);
    container.registerSingleton(UserRepository.name, UserRepository);
    container.registerSingleton(CategoryRepository.name, CategoryRepository);
    container.registerSingleton(
        TransactionRepository.name,
        TransactionRepository,
    );
    container.registerSingleton(BalanceRepository.name, BalanceRepository);
}
