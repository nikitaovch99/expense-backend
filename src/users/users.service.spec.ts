import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/categories.entity';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Transaction } from '../transactions/transactions.entity';
import { SessionAuthService } from '../session-auth/session-auth.service';
import { Session } from '../session-auth/session.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import * as bcrypt from 'bcryptjs';
import { HttpException, NotFoundException } from '@nestjs/common';
import {
  testUser2,
  testUser3,
  normalizedTestUser,
  testUsers,
  testUserDto2,
  testAdmin,
  testTransaction,
  testRequest,
  testAdmin2,
  testUpdateDto,
  testNormalizedUser2,
  testNormalizedAndUpdatedUser2,
} from './user.test-entities';
import { testCategory } from '../categories/categories.test-entitites';

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;
  let categoryRepository: Repository<Category>;
  let categoryService: CategoriesService;
  let transactionRepository: Repository<Transaction>;
  let authService: SessionAuthService;

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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    categoryService = module.get<CategoriesService>(CategoriesService);
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    authService = module.get<SessionAuthService>(SessionAuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  it('userReposityory should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('getAllUsers method', () => {
    it('should return array of users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(testUsers);

      const result = await userService.getAllUsers();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual([normalizedTestUser]);
    });
  });
  describe('getUserByUsername method', () => {
    it('should return a user ', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(testUser3);
      const result = await userService.getUserByUsername('test3');
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(result).toEqual(testUser3);
    });
    it('should return a null', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const result = await userService.getUserByUsername('test3');
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(result).toEqual(null);
    });
  });

  describe('getUserByUsernameOrFail method', () => {
    it('should return a user ', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(testUser3);
      const result = await userService.getUserByUsernameOrFail('test3');
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(result).toEqual(testUser3);
    });
    it('should throw an exception ', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(
        userService.getUserByUsernameOrFail('test3'),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('createUser method', () => {
    it('should call userRepository.create with corrrect params and create a user', async () => {
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValueOnce(null);
      jest
        .spyOn(categoryService, 'createDefaultCategory')
        .mockResolvedValue(testCategory);
      jest.spyOn(userRepository, 'create').mockReturnValue(testUser2);
      jest.spyOn(userRepository, 'save').mockResolvedValue(testUser2);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(testCategory);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hash123'));

      const result = await userService.createUser(testUserDto2);
      expect(userService.getUserByUsername).toHaveBeenCalledWith('test2');
      expect(categoryService.createDefaultCategory).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('user123', 5);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'test2',
        password: 'hash123',
        displayName: 'test',
        categories: [testCategory],
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(categoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual(testUser2);
    });
    it('should throw an exception when the candidate already exists ', async () => {
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockResolvedValueOnce(testUser2);
      await expect(userService.createUser(testUserDto2)).rejects.toThrow(
        HttpException,
      );
      expect(userService.getUserByUsername).toHaveBeenCalled();
    });
  });
  describe('getUserById method', () => {
    it('return a user when a user trying to access himself', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testUser2);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(testUser2);

      const result = await userService.getUserById(2, 'test2');
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(testUser2);
    });
    it('return a user when an admin trying to access user', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testAdmin);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(testUser2);

      const result = await userService.getUserById(2, 'test1');
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(testUser2);
    });
    it('throw an error when user trying to access other user', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testUser2);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(testUser3);
      await expect(userService.getUserById(3, 'test2')).rejects.toThrow(
        HttpException,
      );
      expect(userService.getUserByUsernameOrFail).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });
  describe('remove method', () => {
    it('should be called with correct params', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testUser2);
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(testUser2);
      jest.spyOn(categoryRepository, 'remove').mockResolvedValue(testCategory);
      jest
        .spyOn(transactionRepository, 'remove')
        .mockResolvedValue(testTransaction);
      jest.spyOn(authService, 'logout').mockResolvedValueOnce({ logout: true });
      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(testUser2);

      await userService.remove(2, 'test2', testRequest);

      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test2');
      expect(userService.getUserById).toBeCalledWith(2, 'test2');
      expect(categoryRepository.remove).toHaveBeenCalledWith(
        testUser2.categories[0],
      );
      expect(transactionRepository.remove).toHaveBeenCalledWith(
        testUser2.transactions[0],
      );
      expect(authService.logout).toHaveBeenCalledWith(testRequest);
      expect(userRepository.remove).toHaveBeenCalledWith(testUser2);
    });
    it('should throw an exception when Admin tries to remove another Admin', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testAdmin);
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(testAdmin2);
      await expect(userService.remove(4, 'test1', testRequest)).rejects.toThrow(
        HttpException,
      );
      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test1');
      expect(userService.getUserById).toBeCalledWith(4, 'test1');
    });
  });
  describe('update method', () => {
    it('should return an updated user ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testUser2);
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(testUser2);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('newHash'));
      jest.spyOn(authService, 'logout').mockResolvedValueOnce({ logout: true });
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(testUser2);

      const result = await userService.update(
        2,
        'test2',
        testUpdateDto,
        testRequest,
      );
      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test2');
      expect(userService.getUserById).toBeCalledWith(2, 'test2');
      expect(bcrypt.hash).toBeCalledWith('newPass', 5);
      expect(authService.logout).toBeCalledWith(testRequest);
      expect(userRepository.save).toBeCalledWith(testUser2);
      expect(result).toEqual(testNormalizedAndUpdatedUser2);
    });
    it('should throw an exception when no params ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testAdmin);
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(testUser2);
      await expect(
        userService.update(2, 'test1', {}, testRequest),
      ).rejects.toThrow(HttpException);
      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test1');
      expect(userService.getUserById).toBeCalledWith(2, 'test1');
    });
    it('should throw an exception when Admin tries to update another Admin', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValueOnce(testAdmin);
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(testAdmin2);
      await expect(
        userService.update(4, 'test1', testUpdateDto, testRequest),
      ).rejects.toThrow(HttpException);
      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test1');
      expect(userService.getUserById).toBeCalledWith(4, 'test1');
    });
  });
  describe('normalize method', () => {
    it('should return a normalized user', () => {
      const result = userService.normalize(testUser2);

      expect(result).toEqual(testNormalizedUser2);
    });
  });
});
