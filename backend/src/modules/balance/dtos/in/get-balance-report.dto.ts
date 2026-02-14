import { z } from 'zod';

const BRDateString = z
    .string()
    .regex(
        /^\d{2}\/\d{2}\/\d{4}$/i,
        'Invalid date format. Expected DD/MM/YYYY',
    );

export const GetBalanceReportDTOSchema = z
    .object({
        startDate: BRDateString,
        endDate: BRDateString,
    })
    .strict();

export type GetBalanceReportDTO = z.infer<typeof GetBalanceReportDTOSchema>;
