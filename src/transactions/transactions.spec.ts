import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/categories.entity';
import { Transaction } from '../transactions/transactions.entity';
import { SessionAuthService } from '../session-auth/session-auth.service';
import { Session } from '../session-auth/session.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { HttpException, NotFoundException } from '@nestjs/common';
import {
  testCategory,
  testUser2,
  testUser3,
} from '../categories/categories.test-entitites';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { testTransaction } from '../users/user.test-entities';
import {
  category2,
  normalizedTestTransaction,
  normalizedTransaction1,
  testTransactionDto,
  testUpdateTransactionDto,
  transaction1,
  updatedTransaction1,
  user1,
  user2,
} from './transactions.test-entities';

describe('TransactionService', () => {
  let userService: UsersService;
  let categoryService: CategoriesService;
  let transactionService: TransactionsService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        SessionAuthService,
        {
          provide: getRepositoryToken(Session),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    categoryService = module.get<CategoriesService>(CategoriesService);
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    transactionService = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });
  it('userReposityory should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });
  describe('create', () => {
    it('should accept correct parms and return created Transaction', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest
        .spyOn(categoryService, 'getUsersCategoryByLabel')
        .mockResolvedValue(testCategory);
      jest
        .spyOn(transactionRepository, 'create')
        .mockReturnValue(testTransaction);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(testTransaction);
      const result = await transactionService.create(
        testTransactionDto,
        'test2',
      );
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test2');
      expect(categoryService.getUsersCategoryByLabel).toHaveBeenCalledWith(
        testTransactionDto.categoryLabel,
        testUser2,
      );
      expect(transactionRepository.create).toHaveBeenCalledWith(
        testTransactionDto,
      );
      expect(transactionRepository.save).toHaveBeenCalledWith(testTransaction);
      expect(result).toEqual(normalizedTestTransaction);
    });
  });
  describe('getUserTransactions method', () => {
    it('should accept correct params and return all Users Transactions', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest
        .spyOn(transactionRepository, 'find')
        .mockResolvedValue([testTransaction]);
      const result = await transactionService.getUserTransactions('test2');
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test2');
      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: testUser2.id } },
        relations: ['category'],
      });
      expect(result).toEqual([testTransaction]);
    });
  });
  describe('getAll method', () => {
    it('should return all transactions ', async () => {
      jest
        .spyOn(transactionRepository, 'find')
        .mockResolvedValue([testTransaction]);
      const result = await transactionService.getAll();
      expect(result).toEqual([testTransaction]);
    });
  });
  describe('normalize method', () => {
    it('should normalize a user', () => {
      const result = transactionService.normalizeTransaction(testTransaction);

      expect(result).toEqual(normalizedTestTransaction);
    });
  });
  describe('removeTransaction', () => {
    it('should be called with correct parms', async () => {
      jest
        .spyOn(transactionService, 'getTransactionById')
        .mockResolvedValue(testTransaction);
      jest
        .spyOn(transactionRepository, 'remove')
        .mockResolvedValue(testTransaction);

      await transactionService.removeTransaction(1, 'test2');
      expect(transactionService.getTransactionById).toHaveBeenCalledWith(
        1,
        'test2',
      );
      expect(transactionRepository.remove).toHaveBeenCalledWith(
        testTransaction,
      );
    });
  });
  describe('getTransactionById method', () => {
    it('should to call with correct params and return a transaction ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(user2);
      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(transaction1);
      const result = await transactionService.getTransactionById(1, 'test2');
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test2');
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'user'],
      });
      expect(result).toEqual(transaction1);
    });
    it('should throw an exception when a transaction not found', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(user1);
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(null);
      await expect(
        transactionService.getTransactionById(1, 'test2'),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw an exception when no access', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser3);
      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(transaction1);
      await expect(
        transactionService.getTransactionById(1, 'test2'),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('updateTransaction method', () => {
    it('should accept all correct params and return updated transaction', async () => {
      jest
        .spyOn(transactionService, 'getTransactionById')
        .mockResolvedValue(transaction1);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(updatedTransaction1);
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(user2);
      jest
        .spyOn(categoryService, 'getUsersCategoryByLabel')
        .mockResolvedValue(category2);
      const result = await transactionService.updateTransaction(
        testUpdateTransactionDto,
        1,
        'test2',
      );
      expect(transactionService.getTransactionById).toHaveBeenCalledWith(
        1,
        'test2',
      );
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test2');
      expect(categoryService.getUsersCategoryByLabel).toHaveBeenCalledWith(
        testUpdateTransactionDto.categoryLabel,
        user2,
      );
      expect(transactionRepository.save).toBeCalledWith(updatedTransaction1);
      expect(result).toEqual(normalizedTransaction1);
    });
  });
});
