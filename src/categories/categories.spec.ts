import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Category, OtherCategory } from '../categories/categories.entity';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { Transaction } from '../transactions/transactions.entity';
import { SessionAuthService } from '../session-auth/session-auth.service';
import { Session } from '../session-auth/session.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { testUser2, testUser3 } from '../users/user.test-entities';
import {
  createdCategory,
  newNormalizedCategory,
  newTestCategory,
  newTestCategory2,
  newTestCategoryWithUser,
  newUpdatedCategory2,
  removeCategory,
  testCategory,
  testCreateCategoryDto,
  updateTransaction,
} from './categories.test-entitites';

describe('CategoriesService', () => {
  let userService: UsersService;
  let categoryRepository: Repository<Category>;
  let categoryService: CategoriesService;
  let transactionService: TransactionsService;

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
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    categoryService = module.get<CategoriesService>(CategoriesService);
    transactionService = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  it('categoryRepository should be defined', () => {
    expect(categoryRepository).toBeDefined();
  });

  describe('createCategory method', () => {
    it('should call createCategory with correct params and return created Category ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser3);
      jest.spyOn(categoryRepository, 'create').mockReturnValue(newTestCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(newTestCategory);
      const result = await categoryService.createCategory(
        { label: 'Car' },
        'test3',
      );
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test3');
      expect(categoryRepository.create).toHaveBeenCalledWith(
        testCreateCategoryDto,
      );
      expect(categoryRepository.save).toHaveBeenCalledWith(
        newTestCategoryWithUser,
      );
      expect(result).toEqual(createdCategory);
    });
    it('should throw an exception if category already exists', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      await expect(
        categoryService.createCategory({ label: OtherCategory.label }, 'test2'),
      ).rejects.toThrow(HttpException);
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test2');
    });
  });
  describe('createDefaultCategory', () => {
    it('should create a default category ', async () => {
      jest.spyOn(categoryRepository, 'create').mockReturnValue(testCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(testCategory);
      const result = await categoryService.createDefaultCategory();
      expect(categoryRepository.create).toHaveBeenCalledWith({
        label: OtherCategory.label,
      });
      expect(categoryRepository.save).toHaveBeenCalledWith(testCategory);
      expect(result).toEqual(testCategory);
    });
  });
  describe('getCategoryById', () => {
    it('should be called with correct params and return a user ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(testCategory);
      const result = await categoryService.getCategoryById(
        1,
        testUser2.username,
      );
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith(
        testUser2.username,
      );
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { transactions: true, user: { categories: true } },
      });
      expect(result).toEqual(testCategory);
    });
    it('should throw an exception when no category', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);
      await expect(categoryService.getCategoryById(1, 'test2')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw an exception if you have no access', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser3);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(testCategory);
      await expect(categoryService.getCategoryById(1, 'test3')).rejects.toThrow(
        HttpException,
      );
    });
  });
  describe('getAll method', () => {
    it('should return all categories ', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([testCategory]);
      const result = await categoryService.getAll();
      expect(categoryRepository.find).toHaveBeenCalled();
      expect(result).toEqual([testCategory]);
    });
  });
  describe('getAllUserCategories method', () => {
    it('should return all categories ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([testCategory]);
      const result = await categoryService.getAllUserCategories('test2');
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalledWith('test2');
      expect(categoryRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 2 } },
      });
      expect(result).toEqual([testCategory]);
    });
  });
  describe('removeCategory', () => {
    it('should call it with correct params ', async () => {
      jest
        .spyOn(categoryService, 'getCategoryById')
        .mockResolvedValue(removeCategory);
      jest
        .spyOn(transactionService, 'updateTransaction')
        .mockResolvedValue(updateTransaction);
      jest
        .spyOn(transactionService, 'removeTransaction')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(categoryRepository, 'remove')
        .mockResolvedValue(removeCategory);
      await categoryService.removeCategory(3, 'test3');
      expect(categoryService.getCategoryById).toHaveBeenCalledWith(3, 'test3');
      expect(transactionService.updateTransaction).toHaveBeenCalledWith(
        { categoryLabel: OtherCategory.label },
        updateTransaction.id,
        'test3',
      );
    });
    it(`should throw an exception if there is category is ${OtherCategory.label}`, async () => {
      jest
        .spyOn(categoryService, 'getCategoryById')
        .mockResolvedValue(testCategory);
      await expect(categoryService.removeCategory(2, 'test2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('updateCategory method', () => {
    it('should call update method with correct params and return updated category ', async () => {
      jest
        .spyOn(categoryService, 'getCategoryById')
        .mockResolvedValue(newTestCategory2);
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(newUpdatedCategory2);

      const result = await categoryService.updateCategory(
        'Not a Car',
        2,
        'test2',
      );
      expect(result).toEqual(newNormalizedCategory);
    });
    it(`should throw an exception if there is category is ${OtherCategory.label}`, async () => {
      jest
        .spyOn(categoryService, 'getCategoryById')
        .mockResolvedValue(testCategory);
      await expect(
        categoryService.updateCategory('NotAnother', 2, 'test2'),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw an exception if the Dto label is category a ${OtherCategory.label}`, async () => {
      jest
        .spyOn(categoryService, 'getCategoryById')
        .mockResolvedValue(newTestCategory2);
      await expect(
        categoryService.updateCategory(OtherCategory.label, 2, 'test2'),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('GetUsersCategoryByLabel method', () => {
    it('should return a founded Category ', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(testCategory);
      const result = await categoryService.getUsersCategoryByLabel(
        OtherCategory.label,
        testUser2,
      );
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: testCategory.id },
        relations: ['transactions'],
      });
      expect(result).toEqual(testCategory);
    });
    it('should throw an exception', async () => {
      await expect(
        categoryService.getUsersCategoryByLabel('Not Another', testUser2),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('normalizeCategory method', () => {
    it('should normalize returned category', () => {
      const result = categoryService.normalizeCategory(newUpdatedCategory2);
      expect(result).toEqual(newNormalizedCategory);
    });
  });
});
