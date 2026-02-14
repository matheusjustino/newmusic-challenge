import { inject, injectable } from 'tsyringe';

import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository';
import { CreateTransactionDTO } from '@/modules/transaction/dto/in/create-transaction.dto';
import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { TransactionDTO } from '../dto/out/transaction.dto';
import { CustomerError } from '@/common/errors/customer.error';

@injectable()
export class CreateTransactionUseCase {
    constructor(
        @inject(TransactionRepository.name)
        private readonly transactionRepository: TransactionRepository,
        @inject(CategoryRepository.name)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async execute(
        userId: string,
        data: CreateTransactionDTO,
    ): Promise<TransactionDTO> {
        const category = await this.categoryRepository.getCategoryByIdAndUserId(
            data.categoryId,
            userId,
        );
        if (!category) {
            throw new CustomerError('Category not found', 404);
        }

        const transaction = await this.transactionRepository.create(userId, {
            ...data,
            amount: Math.round(data.amount * 100), // convert to cents with rounding to avoid FP errors
        });
        return new TransactionDTO(transaction);
    }
}
