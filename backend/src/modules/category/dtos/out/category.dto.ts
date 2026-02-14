import z from 'zod';

import { CategoryInterface } from '@/infrastructure/database/entities/category.entity';

export const CategoryResponseSchema = z.object({
    id: z.uuid('v4'),
    name: z.string(),
    description: z.string(),
    userId: z.uuid('v4'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CategoryResponseDTO = z.infer<typeof CategoryResponseSchema>;

export class CategoryDTO implements CategoryResponseDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly userId: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(category: CategoryInterface) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.userId = category.userId;
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;
        Object.freeze(this);
    }
}
