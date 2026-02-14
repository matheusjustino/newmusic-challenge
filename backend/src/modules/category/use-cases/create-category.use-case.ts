import { inject, injectable } from 'tsyringe';

import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { CustomerError } from '@/common/errors/customer.error';

import { CreateCategoryDTO } from '../dtos/in/create-category.dto';
import { CategoryDTO } from '../dtos/out/category.dto';

@injectable()
export class CreateCategoryUseCase {
    constructor(
        @inject(CategoryRepository.name)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async execute(
        userId: string,
        data: CreateCategoryDTO,
    ): Promise<CategoryDTO> {
        const categoryExists =
            await this.categoryRepository.findByNameAndUserId(
                data.name,
                userId,
            );
        if (categoryExists) {
            throw new CustomerError('Category already exists', 400);
        }

        const category = await this.categoryRepository.create(userId, data);
        return new CategoryDTO(category);
    }
}
