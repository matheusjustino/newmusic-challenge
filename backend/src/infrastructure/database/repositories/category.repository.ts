import { inject, injectable } from 'tsyringe';
import { and, eq } from 'drizzle-orm';

import { DatabaseConnection } from '@/infrastructure/database/connection';
import {
    CategoryEntity,
    CategoryInterface,
} from '@/infrastructure/database/entities/category.entity';
import { CreateCategoryDTO } from '@/modules/category/dtos/in/create-category.dto';
import { UpdateCategoryDTO } from '@/modules/category/dtos/in/update-category.dto';

@injectable()
export class CategoryRepository {
    constructor(
        @inject(DatabaseConnection)
        private readonly database: DatabaseConnection,
    ) {}

    async create(
        userId: string,
        data: CreateCategoryDTO,
    ): Promise<CategoryInterface> {
        const [category] = await this.database.db
            .insert(CategoryEntity)
            .values({
                userId,
                ...data,
            })
            .returning();

        return category;
    }

    async findByNameAndUserId(
        name: string,
        userId: string,
    ): Promise<CategoryInterface | null> {
        const category = await this.database.db.query.Category.findFirst({
            where: and(
                eq(CategoryEntity.name, name),
                eq(CategoryEntity.userId, userId),
            ),
        });
        return category ?? null;
    }

    async getCategoryByIdAndUserId(
        categoryId: string,
        userId: string,
    ): Promise<CategoryInterface | null> {
        const category = await this.database.db.query.Category.findFirst({
            where: and(
                eq(CategoryEntity.id, categoryId),
                eq(CategoryEntity.userId, userId),
            ),
        });
        return category ?? null;
    }

    async getCategoriesByUserId(userId: string): Promise<CategoryInterface[]> {
        return await this.database.db
            .select()
            .from(CategoryEntity)
            .where(eq(CategoryEntity.userId, userId));
    }

    async updateCategory(
        userId: string,
        categoryId: string,
        data: UpdateCategoryDTO,
    ): Promise<boolean> {
        const res = await this.database.db
            .update(CategoryEntity)
            .set(data)
            .where(
                and(
                    eq(CategoryEntity.userId, userId),
                    eq(CategoryEntity.id, categoryId),
                ),
            );
        return res.rowCount !== null && res.rowCount > 0;
    }

    async deleteCategory(userId: string, categoryId: string): Promise<boolean> {
        const res = await this.database.db
            .delete(CategoryEntity)
            .where(
                and(
                    eq(CategoryEntity.userId, userId),
                    eq(CategoryEntity.id, categoryId),
                ),
            );
        return res.rowCount !== null && res.rowCount > 0;
    }
}
