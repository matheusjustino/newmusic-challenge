"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const balance_repository_mock_1 = require("@/mocks/balance-repository.mock");
const get_balance_report_use_case_1 = require("@/modules/balance/use-cases/get-balance-report.use-case");
describe('GetBalanceReportUseCase', () => {
    let useCase;
    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new get_balance_report_use_case_1.GetBalanceReportUseCase(balance_repository_mock_1.mockBalanceRepository);
    });
    test('should return balance report with amounts converted from cents to reais and computed balance', async () => {
        balance_repository_mock_1.mockBalanceRepository.getAggregatesByCategory.mockResolvedValueOnce([
            { categoryId: 'c1', count: 2, amount: 12345 }, // R$123.45
            { categoryId: 'c2', count: 1, amount: 500 }, // R$5.00
        ]);
        balance_repository_mock_1.mockBalanceRepository.getAggregatesByType.mockResolvedValueOnce([
            { type: 'income', count: 2, amount: 20000 }, // R$200.00
            { type: 'expense', count: 3, amount: 5000 }, // R$50.00
        ]);
        const result = await useCase.execute('user-1', {
            startDate: '01/01/2024',
            endDate: '31/01/2024',
        });
        expect(result).toEqual({
            balance: 150, // 200 - 50
            byCategory: [
                { categoryId: 'c1', count: 2, amount: 123.45 },
                { categoryId: 'c2', count: 1, amount: 5 },
            ],
            byType: [
                { type: 'income', count: 2, amount: 200 },
                { type: 'expense', count: 3, amount: 50 },
            ],
        });
    });
    test('should call repository with parsed dates and provided userId', async () => {
        balance_repository_mock_1.mockBalanceRepository.getAggregatesByCategory.mockResolvedValueOnce([]);
        balance_repository_mock_1.mockBalanceRepository.getAggregatesByType.mockResolvedValueOnce([]);
        const input = {
            startDate: '01/02/2024',
            endDate: '10/02/2024',
        };
        await useCase.execute('user-xyz', input);
        expect(balance_repository_mock_1.mockBalanceRepository.getAggregatesByCategory).toHaveBeenCalledTimes(1);
        expect(balance_repository_mock_1.mockBalanceRepository.getAggregatesByType).toHaveBeenCalledTimes(1);
        const [userId1, start1, end1] = balance_repository_mock_1.mockBalanceRepository.getAggregatesByCategory.mock.calls[0];
        const [userId2, start2, end2] = balance_repository_mock_1.mockBalanceRepository.getAggregatesByType.mock.calls[0];
        expect(userId1).toBe('user-xyz');
        expect(userId2).toBe('user-xyz');
        expect(start1).toBeInstanceOf(Date);
        expect(end1).toBeInstanceOf(Date);
        expect(start2).toBeInstanceOf(Date);
        expect(end2).toBeInstanceOf(Date);
        // 01/02/2024 -> new Date(2024, 1, 1), 10/02/2024 -> new Date(2024, 1, 10)
        expect(start1.getFullYear()).toBe(2024);
        expect(start1.getMonth()).toBe(1);
        expect(start1.getDate()).toBe(1);
        expect(end1.getFullYear()).toBe(2024);
        expect(end1.getMonth()).toBe(1);
        expect(end1.getDate()).toBe(10);
        expect(start2.getTime()).toBe(start1.getTime());
        expect(end2.getTime()).toBe(end1.getTime());
    });
});
