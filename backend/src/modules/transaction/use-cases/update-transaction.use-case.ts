import { inject, injectable } from 'tsyringe';

import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository';
import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { UpdateTransactionDTO } from '../dto/in/update-transaction.dto';
import { CustomerError } from '@/common/errors/customer.error';

@injectable()
export class UpdateTransactionUseCase {
    constructor(
        @inject(TransactionRepository.name)
        private readonly transactionRepository: TransactionRepository,
        @inject(CategoryRepository.name)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async execute(
        userId: string,
        transactionId: string,
        data: UpdateTransactionDTO,
    ): Promise<boolean> {
        if (data.categoryId) {
            const category =
                await this.categoryRepository.getCategoryByIdAndUserId(
                    data.categoryId,
                    userId,
                );
            if (!category) {
                throw new CustomerError('Category not found', 404);
            }
        }

        const updated =
            await this.transactionRepository.updateTransactionByUserId(
                userId,
                transactionId,
                {
                    ...data,
                    ...(data.amount && { amount: data.amount * 100 }),
                },
            );
        if (!updated) {
            throw new CustomerError('Failed to update transaction', 404);
        }
        return updated;
    }
}
