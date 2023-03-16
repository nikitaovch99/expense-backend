import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/categories.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export interface UserPayload {
  id: number;
  username: string;
  displayName: string;
  password: string;
  role: Role;
  categories: Category[];
  transactions: Transaction[];
}

export interface NormalizedUser {
  id: number;
  username: string;
  displayName: string;
  role: Role;
  categories: Category[];
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: '1', description: 'unique identificator' })
  @PrimaryGeneratedColumn()
  id!: number;
  @ApiProperty({ example: 'firstUser', description: 'username' })
  @Column({ unique: true })
  username!: string;
  @ApiProperty({ example: 'first1234', description: 'password' })
  @Column()
  password!: string;
  @ApiProperty({ example: 'first', description: 'Displayed name' })
  @Column()
  displayName!: string;

  @ApiProperty({ example: 'USER', description: 'role of a user' })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role!: Role;

  @OneToMany(() => Category, (category) => category.user, { cascade: true })
  categories!: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: true,
  })
  transactions!: Transaction[];

  @ApiProperty({
    example: '2023-03-10T09:00:32.011Z',
    description: 'time of creation',
  })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({
    example: '2023-03-10T09:00:32.011Z',
    description: 'time when the field was updated',
  })
  @UpdateDateColumn()
  updatedAt: string;
}
