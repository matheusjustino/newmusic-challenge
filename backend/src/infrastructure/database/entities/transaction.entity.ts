import {
    pgEnum,
    uuid,
    integer,
    timestamp,
    boolean,
    varchar,
    pgTable,
    index,
} from 'drizzle-orm/pg-core';

import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';

export const TransactionTypeEnum = pgEnum('transaction_type', [
    'income',
    'expense',
]);

export const TransactionEntity = pgTable(
    'transactions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => UserEntity.id, {
                onDelete: 'cascade',
            }),
        categoryId: uuid('category_id')
            .notNull()
            .references(() => CategoryEntity.id, {
                onDelete: 'cascade',
            }),
        type: TransactionTypeEnum('type').notNull(),
        amount: integer('amount').notNull(),
        date: timestamp('date', { withTimezone: true }).notNull(),
        description: varchar('description', { length: 255 }).notNull(),
        isExtra: boolean('is_extra').default(false).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => {
        return {
            userDateTypeIndex: index('transactions_user_date_type_idx').on(
                table.userId,
                table.date,
                table.type,
            ),

            categoryIndex: index('transactions_category_idx').on(
                table.categoryId,
            ),
        };
    },
);

export type TransactionInterface = typeof TransactionEntity.$inferSelect;
export type TransactionType = (typeof TransactionTypeEnum.enumValues)[number];
