import { inject, injectable } from 'tsyringe';

import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginatedTransactionResponseDTO } from '../dto/out/paginated-transaction-response.dto';

@injectable()
export class GetTransactionsUseCase {
    constructor(
        @inject(TransactionRepository.name)
        private readonly transactionRepository: TransactionRepository,
    ) {}

    public async execute(
        userId: string,
        pagination: PaginationDTO,
    ): Promise<PaginatedTransactionResponseDTO> {
        const { data: transactions, totalItems } =
            await this.transactionRepository.getTransactionsByUserId(
                userId,
                pagination,
            );

        return {
            meta: {
                totalItems,
                totalPages: Math.ceil(totalItems / pagination.perPage),
                currentPage: pagination.page,
                itemsPerPage: pagination.perPage,
            },
            data: transactions,
        };
    }
}
