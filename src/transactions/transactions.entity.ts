import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export interface NormalizedTransaction {
  id: number;
  label: string;
  date: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity({ name: 'transactions' })
export class Transaction {
  @ApiProperty({ example: '1', description: 'unique identificator' })
  @PrimaryGeneratedColumn()
  id!: number;
  @ApiProperty({ example: '-10', description: 'transaction label' })
  @Column()
  label!: string;
  @ApiProperty({ example: 'YYYY-MM-DD', description: 'time of transaction' })
  @Column()
  date!: Date;
  @ApiProperty({ example: 10, description: 'total amount after transaction' })
  @Column()
  amount!: number;
  @ApiProperty({
    example: '2023-03-10T09:00:32.011Z',
    description: 'time when the field was created',
  })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({
    example: '2023-03-10T09:00:32.011Z',
    description: 'time when the field was updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'CASCADE',
  })
  category?: Category;
}
