import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/categories.entity';
import { Transaction } from '../transactions/transactions.entity';
import { SessionAuthService } from '../session-auth/session-auth.service';
import { Session } from '../session-auth/session.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { testUser2, testUserDto2 } from '../users/user.test-entities';
import * as bcrypt from 'bcryptjs';

describe('Name of the group', () => {
  let userService: UsersService;
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
    authService = module.get<SessionAuthService>(SessionAuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateUser method', () => {
    it('should validate and return a User ', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const result = await authService.validateUser('test2', 'hash123');
      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test2');
      expect(bcrypt.compare).toBeCalledWith('hash123', testUser2.password);
      expect(result).toEqual(testUser2);
    });
    it('should throw an exception when passwords do not match', async () => {
      jest
        .spyOn(userService, 'getUserByUsernameOrFail')
        .mockResolvedValue(testUser2);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      await expect(
        authService.validateUser('test2', 'wrongPass'),
      ).rejects.toThrow(HttpException);
      expect(userService.getUserByUsernameOrFail).toBeCalledWith('test2');
      expect(bcrypt.compare).toBeCalledWith('wrongPass', testUser2.password);
    });
  });
  describe('registration method', () => {
    it('should return a created user ', async () => {
      jest.spyOn(userService, 'createUser').mockResolvedValue(testUser2);
      const result = await authService.registration(testUserDto2);
      expect(userService.createUser).toHaveBeenCalledWith(testUserDto2);
      expect(result).toEqual(testUser2);
    });
  });
  describe('logout', () => {
    it('should logout the user and return { logout: true }', async () => {
      const request = { logOut: jest.fn() } as any;
      jest
        .spyOn(request, 'logOut')
        .mockImplementation((options, callback) =>
          (callback as (error: Error | undefined) => void)(undefined),
        );
      const result = await authService.logout(request);

      expect(request.logOut).toHaveBeenCalledWith(
        { keepSessionInfo: false },
        expect.any(Function),
      );
      expect(result).toEqual({ logout: true });
    });

    it('should throw InternalServerErrorException if an error occurs during logout', async () => {
      const request = {
        logOut: jest.fn((options, callback) => callback(new Error('error'))),
      } as any;

      await expect(authService.logout(request)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
