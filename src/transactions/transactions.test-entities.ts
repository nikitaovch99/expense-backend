import { Category, OtherCategory } from '../categories/categories.entity';
import { Role, User } from '../users/users.entity';
import { createTransactionDto } from './dto/create-transaction.dto';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { NormalizedTransaction, Transaction } from './transactions.entity';

export const normalizedTestTransaction: NormalizedTransaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
};

export const testTransactionDto: createTransactionDto = {
  label: 'NewCar',
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
  categoryLabel: OtherCategory.label,
};

export const category2: Category = {
  id: 2,
  label: 'Food',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: new User(),
  transactions: [],
};

export const testUpdateTransactionDto: updateTransactionDto = {
  label: 'Burger',
  date: new Date(2023, 0, 1, 12, 13, 15),
  amount: 50,
  categoryLabel: OtherCategory.label,
};

export const category1: Category = {
  id: 1,
  label: OtherCategory.label,
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  user: new User(),
  transactions: [],
};

export const user2: User = {
  id: 2,
  username: 'test2',
  displayName: 'test',
  password: 'hash123',
  role: Role.User,
  transactions: [],
  categories: [category1],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};

export const transaction1: Transaction = {
  id: 1,
  label: 'NewCar',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  category: category1,
  date: new Date(2023, 0, 1, 12, 13, 14),
  amount: 0,
  user: user2,
};
export const updatedTransaction1: Transaction = {
  id: 1,
  label: 'Burger',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  category: category2,
  date: new Date(2023, 0, 1, 12, 13, 15),
  amount: 50,
  user: user2,
};

export const normalizedTransaction1: NormalizedTransaction = {
  id: 1,
  label: 'Burger',
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
  date: new Date(2023, 0, 1, 12, 13, 15),
  amount: 50,
};

export const user1: User = {
  id: 2,
  username: 'test2',
  displayName: 'test',
  password: 'hash123',
  role: Role.User,
  transactions: [transaction1],
  categories: [category1],
  createdAt: new Date(2023, 0, 1, 12, 13, 14),
  updatedAt: new Date(2023, 0, 1, 12, 13, 14),
};
