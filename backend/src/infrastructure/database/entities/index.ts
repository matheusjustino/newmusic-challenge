import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { TransactionEntity } from './transaction.entity';

export const schema = {
    User: UserEntity,
    Category: CategoryEntity,
    Transaction: TransactionEntity,
};
