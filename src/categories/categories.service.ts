import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { Role, User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import {
  Category,
  NormalizedCategory,
  OtherCategory,
} from './categories.entity';
import { createCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private userService: UsersService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionService: TransactionsService,
  ) {}

  async createCategory(
    dto: createCategoryDto,
    username: string,
  ): Promise<NormalizedCategory> {
    const user = await this.userService.getUserByUsernameOrFail(username);

    const categoryExists = user.categories.find(
      (category) => category.label === dto.label,
    );

    if (categoryExists) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const category = this.categoryRepository.create({ ...dto, user });
    const savedCategory = await this.categoryRepository.save(category);
    return this.normalizeCategory(savedCategory);
  }

  createDefaultCategory(): Promise<Category> {
    const category = this.categoryRepository.create({
      label: OtherCategory.label,
    });
    return this.categoryRepository.save(category);
  }

  async getCategoryById(id: number, username: string): Promise<Category> {
    const user = await this.userService.getUserByUsernameOrFail(username);
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { transactions: true, user: { categories: true } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (user.role !== Role.Admin && user.id !== category.user.id) {
      throw new HttpException(
        'You have no access to categories of other users',
        HttpStatus.FORBIDDEN,
      );
    }
    return category;
  }

  getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getAllUserCategories(username: string): Promise<Category[]> {
    const user = await this.userService.getUserByUsernameOrFail(username);
    return this.categoryRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async removeCategory(id: number, username: string): Promise<void> {
    const category = await this.getCategoryById(id, username);
    if (category.label === OtherCategory.label) {
      throw new BadRequestException(
        `Can not delete category ${OtherCategory.label}`,
      );
    }

    await Promise.all(
      category.transactions.map(async (transaction) => {
        await this.transactionService.updateTransaction(
          { categoryLabel: OtherCategory.label },
          transaction.id,
          username,
        );
      }),
    );

    await this.categoryRepository.remove(category);
  }

  async updateCategory(
    label: string,
    id: number,
    username: string,
  ): Promise<NormalizedCategory> {
    const category = await this.getCategoryById(id, username);
    if (
      category.label === OtherCategory.label ||
      label === OtherCategory.label
    ) {
      throw new BadRequestException(
        `Can not update category ${OtherCategory.label}`,
      );
    }

    category && (category.label = label);
    const savedCategory = await this.categoryRepository.save(category);
    return this.normalizeCategory(savedCategory);
  }

  async getUsersCategoryByLabel(label: string, user: User): Promise<Category> {
    const category = user.categories.find(
      (category) => category.label === label,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoryRepository.findOne({
      where: { id: category.id },
      relations: ['transactions'],
    });
  }

  normalizeCategory({ id, label, createdAt, updatedAt }): NormalizedCategory {
    return { id, label, createdAt, updatedAt };
  }
}
