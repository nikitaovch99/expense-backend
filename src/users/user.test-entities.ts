import { Request } from 'express';
import { testCategory } from '../categories/categories.test-entitites';
import { Category } from '../categories/categories.entity';
import { Transaction } from '../transactions/transactions.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { NormalizedUser, Role, User } from './users.entity';

export const testRequest: Request = {} as Request;

export const testTransaction: Transaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  category: new Category(),
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
  user: new User(),
};

export const testUser2: User = {
  id: 2,
  username: 'test2',
  displayName: 'test',
  password: 'hash123',
  role: Role.User,
  transactions: [testTransaction],
  categories: [testCategory],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const testUpdateDto: UpdateUserDto = {
  displayName: 'testName',
  password: 'newPass',
  role: Role.Admin,
};

export const updatedUser2: User = {
  id: 2,
  username: 'test2',
  displayName: 'testName',
  password: 'newHash',
  role: Role.User,
  transactions: [testTransaction],
  categories: [testCategory],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const testNormalizedAndUpdatedUser2: NormalizedUser = {
  id: 2,
  username: 'test2',
  displayName: 'testName',
  role: Role.User,
  transactions: [testTransaction],
  categories: [testCategory],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};
export const testNormalizedUser2: NormalizedUser = {
  id: 2,
  username: 'test2',
  displayName: 'testName',
  role: Role.User,
  transactions: [testTransaction],
  categories: [testCategory],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};
export const testAdmin: User = {
  id: 1,
  username: 'test1',
  displayName: 'test',
  password: 'hash123',
  role: Role.Admin,
  transactions: [],
  categories: [],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};
export const testAdmin2: User = {
  id: 4,
  username: 'testAdm2',
  displayName: 'test',
  password: 'hash123',
  role: Role.Admin,
  transactions: [],
  categories: [],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};
export const testUser3: User = {
  id: 3,
  username: 'test3',
  displayName: 'test',
  password: '',
  role: Role.User,
  transactions: [],
  categories: [],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const normalizedTestUser: NormalizedUser = {
  id: 3,
  username: 'test3',
  displayName: 'test',
  role: Role.User,
  transactions: [],
  categories: [],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const testUserDto2 = {
  username: 'test2',
  password: 'user123',
  displayName: 'test',
};
export const testUsers: User[] = [testUser3];
