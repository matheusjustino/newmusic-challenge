import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';

import { UserEntity } from './user.entity';

export const CategoryEntity = pgTable(
    'categories',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => UserEntity.id, {
                onDelete: 'cascade',
            }),
        name: varchar('name', { length: 255 }).notNull(),
        description: varchar('description', { length: 255 }).notNull(),
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
            userIndex: index('categories_user_idx').on(table.userId),

            uniqueUserCategory: uniqueIndex('categories_user_name_unique').on(
                table.userId,
                table.name,
            ),
        };
    },
);

export type CategoryInterface = typeof CategoryEntity.$inferSelect;
