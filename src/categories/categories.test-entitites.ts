import { Transaction } from 'src/transactions/transactions.entity';
import { Role, User } from '../users/users.entity';
import {
  Category,
  NormalizedCategory,
  OtherCategory,
} from './categories.entity';

export const testUser2: User = {
  id: 2,
  username: 'test2',
  displayName: 'test',
  password: 'hash123',
  role: Role.User,
  transactions: [],
  categories: [],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const testCategory: Category = {
  id: 1,
  label: OtherCategory.label,
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: testUser2,
  transactions: [],
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

export const testBeforeTransaction: Transaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  category: testCategory,
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
  user: new User(),
};

export const testUpdatedTransaction: Transaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  category: testCategory,
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
  user: new User(),
};

export const newTestCategory: Category = {
  id: 2,
  label: 'Car',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: testUser3,
  transactions: [],
};

export const newTestCategory2: Category = {
  id: 3,
  label: 'Car',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: testUser3,
  transactions: [],
};
export const newUpdatedCategory2: Category = {
  id: 3,
  label: 'Not a Car',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: testUser3,
  transactions: [],
};
export const newNormalizedCategory: NormalizedCategory = {
  id: 3,
  label: 'Not a Car',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const testNewTransaction: Transaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  category: newTestCategory,
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
  user: new User(),
};

export const newTestCategoryWithUser: Category = {
  id: 2,
  label: 'Car',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: testUser3,
  transactions: [],
};

export const createdCategory: NormalizedCategory = {
  id: 2,
  label: 'Car',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const testCreateCategoryDto = {
  label: 'Car',
  user: testUser3,
};

export const pushTransaction: Transaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(),
  updatedAt: new Date(),
  category: null,
  date: new Date(),
  amount: 0,
  user: new User(),
};

export const removeCategory = {
  id: 2,
  label: 'Car',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: testUser2,
  transactions: [pushTransaction],
};

export const updateTransaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(),
  updatedAt: new Date(),
  category: removeCategory,
  date: new Date(),
  amount: 0,
  user: new User(),
};
