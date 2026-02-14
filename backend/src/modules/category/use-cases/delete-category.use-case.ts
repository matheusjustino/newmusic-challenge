import { inject, injectable } from 'tsyringe';

import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';

@injectable()
export class DeleteCategoriesUseCase {
    constructor(
        @inject(CategoryRepository.name)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async execute(userId: string, categoryId: string): Promise<boolean> {
        return await this.categoryRepository.deleteCategory(userId, categoryId);
    }
}
