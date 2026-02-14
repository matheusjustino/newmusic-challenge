import { inject, injectable } from 'tsyringe';

import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository';
import { CustomerError } from '@/common/errors/customer.error';

@injectable()
export class DeleteTransactionUseCase {
    constructor(
        @inject(TransactionRepository.name)
        private readonly transactionRepository: TransactionRepository,
    ) {}

    public async execute(
        userId: string,
        transactionId: string,
    ): Promise<boolean> {
        const transactionExists =
            await this.transactionRepository.getTransactionByUserId(
                userId,
                transactionId,
            );
        if (!transactionExists) {
            throw new CustomerError('Transaction not found', 404);
        }
        return await this.transactionRepository.deleteTransactionByUserId(
            userId,
            transactionId,
        );
    }
}
