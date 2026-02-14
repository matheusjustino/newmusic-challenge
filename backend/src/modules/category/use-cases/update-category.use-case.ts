import { inject, injectable } from 'tsyringe';

import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { UpdateCategoryDTO } from '../dtos/in/update-category.dto';

@injectable()
export class UpdateCategoriesUseCase {
    constructor(
        @inject(CategoryRepository.name)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async execute(
        userId: string,
        categoryId: string,
        data: UpdateCategoryDTO,
    ): Promise<boolean> {
        return await this.categoryRepository.updateCategory(
            userId,
            categoryId,
            data,
        );
    }
}
