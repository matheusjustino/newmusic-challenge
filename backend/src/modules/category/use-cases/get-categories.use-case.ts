import { inject, injectable } from 'tsyringe';

import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';

import { CategoryDTO } from '../dtos/out/category.dto';

@injectable()
export class GetCategoriesUseCase {
    constructor(
        @inject(CategoryRepository.name)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async execute(userId: string): Promise<CategoryDTO[]> {
        const categories =
            await this.categoryRepository.getCategoriesByUserId(userId);
        return categories.map((category) => new CategoryDTO(category));
    }
}
