import { inject, injectable } from 'tsyringe';

import {
    BalanceRepository,
    CategoryAggregate,
    TypeAggregate,
} from '@/infrastructure/database/repositories/balance.repository';
import { GetBalanceReportDTO } from '../dtos/in/get-balance-report.dto';
import { BalanceReportResponseDTO } from '../dtos/out/balance-report.dto';

@injectable()
export class GetBalanceReportUseCase {
    constructor(
        @inject(BalanceRepository.name)
        private readonly balanceRepository: BalanceRepository,
    ) {}

    private parseBRDate(value: string): Date {
        const [dd, mm, yyyy] = value.split('/').map((v) => Number(v));
        return new Date(yyyy, mm - 1, dd);
    }

    public async execute(
        userId: string,
        data: GetBalanceReportDTO,
    ): Promise<BalanceReportResponseDTO> {
        const startDate = this.parseBRDate(data.startDate);
        const endDate = this.parseBRDate(data.endDate);

        const [byCategoryRaw, byTypeRaw] = await Promise.all([
            this.balanceRepository.getAggregatesByCategory(
                userId,
                startDate,
                endDate,
            ),
            this.balanceRepository.getAggregatesByType(
                userId,
                startDate,
                endDate,
            ),
        ]);

        // Convert cents to Reais for amounts
        const byCategory = byCategoryRaw.map((r: CategoryAggregate) => ({
            categoryId: r.categoryId,
            count: r.count,
            amount: r.amount / 100,
        }));
        const byType = byTypeRaw.map((r: TypeAggregate) => ({
            type: r.type,
            count: r.count,
            amount: r.amount / 100,
        }));

        const income = byType.find((t) => t.type === 'income')?.amount ?? 0;
        const expense = byType.find((t) => t.type === 'expense')?.amount ?? 0;
        const balance = income - expense;

        return { balance, byCategory, byType };
    }
}
