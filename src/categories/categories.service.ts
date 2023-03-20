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
import { Category, NormalizedCategory } from './categories.entity';
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

  setCategoryRepository(repository: Repository<Category>) {
    this.categoryRepository = repository;
  }

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
    const category = this.categoryRepository.create(dto);
    category.user = user;
    const savedCategory = await this.categoryRepository.save(category);
    return this.normalizeCategory(savedCategory);
  }

  async createDefaultCategory(): Promise<Category> {
    const category = this.categoryRepository.create({ label: 'Інше' });
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

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getAllUserCategories(username: string): Promise<Category[]> {
    const user = await this.userService.getUserByUsernameOrFail(username);
    const categories = await this.categoryRepository.find({
      where: { user: { id: user.id } },
    });
    return categories;
  }

  async removeCategory(id: number, username: string): Promise<void> {
    const category = await this.getCategoryById(id, username);
    if (category.label === 'Інше') {
      throw new BadRequestException('Can not delete category Інше');
    }

    const anotherCategory = category.user.categories.find(
      (category) => category.label === 'Інше',
    );

    await Promise.all(
      category.transactions.map(async (transaction) => {
        await this.transactionService.updateTransaction(
          { category: anotherCategory },
          transaction.id,
          username,
        );
      }),
    );

    await Promise.all(
      category.transactions.map(async (transaction) => {
        await this.transactionService.removeTransaction(
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
    if (category.label === 'Інше') {
      throw new BadRequestException('Can not update category Інше');
    }

    category.label = label;
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

    return category;
  }

  normalizeCategory({ id, label, createdAt, updatedAt }): NormalizedCategory {
    return { id, label, createdAt, updatedAt };
  }
}
