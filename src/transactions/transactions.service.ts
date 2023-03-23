import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Role } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { createTransactionDto } from './dto/create-transaction.dto';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { NormalizedTransaction, Transaction } from './transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private userService: UsersService,
    @Inject(forwardRef(() => CategoriesService))
    private categoryService: CategoriesService,
  ) {}

  async create(
    dto: createTransactionDto,
    username: string,
  ): Promise<NormalizedTransaction> {
    const user = await this.userService.getUserByUsernameOrFail(username);
    const category = await this.categoryService.getUsersCategoryByLabel(
      dto.categoryLabel,
      user,
    );

    const transaction = this.transactionRepository.create(dto);
    transaction.user = user;
    transaction.category = category;
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.normalizeTransaction(savedTransaction);
  }

  async getUserTransactions(username: string): Promise<Transaction[]> {
    const user = await this.userService.getUserByUsernameOrFail(username);
    return this.transactionRepository.find({
      where: { user: { id: user.id } },
      relations: ['category'],
    });
  }

  getAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionById(id: number, username: string): Promise<Transaction> {
    const user = await this.userService.getUserByUsernameOrFail(username);
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (user.role !== Role.Admin && user.id !== transaction.user.id) {
      throw new HttpException(
        'You have no access to categories of other users',
        HttpStatus.FORBIDDEN,
      );
    }
    return transaction;
  }

  async updateTransaction(
    dto: updateTransactionDto,
    id: number,
    username: string,
  ): Promise<NormalizedTransaction> {
    const transaction = await this.getTransactionById(id, username);
    dto.label && (transaction.label = dto.label);
    dto.amount && (transaction.amount = dto.amount);
    dto.date && (transaction.date = dto.date);
    if (dto.categoryLabel) {
      const user = await this.userService.getUserByUsernameOrFail(username);
      const category = await this.categoryService.getUsersCategoryByLabel(
        dto.categoryLabel,
        user,
      );
      transaction.category = category;
      category.transactions.push(transaction);
    }

    const savedTransaction = await this.transactionRepository.save(transaction);

    return this.normalizeTransaction(savedTransaction);
  }

  async removeTransaction(id: number, username: string): Promise<void> {
    const transaction = await this.getTransactionById(id, username);

    await this.transactionRepository.remove(transaction);
  }

  normalizeTransaction({
    id,
    label,
    amount,
    date,
    createdAt,
    updatedAt,
  }): NormalizedTransaction {
    return { id, label, amount, date, createdAt, updatedAt };
  }
}
