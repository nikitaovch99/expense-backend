import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../transactions/transactions.entity';
import { User } from '../users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface NormalizedCategory {
  id: number;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}
export const OtherCategory = { label: 'Інше' };

@Entity({ name: 'categories' })
export class Category {
  @ApiProperty({ example: '1', description: 'unique identificator' })
  @PrimaryGeneratedColumn()
  id!: number;
  @ApiProperty({ example: OtherCategory.label, description: 'category name' })
  @Column()
  label!: string;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    cascade: true,
  })
  transactions!: Transaction[];

  @ApiProperty({
    example: '2023-03-10T09:00:32.011Z',
    description: 'time of creation',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-03-10T09:00:32.011Z',
    description: 'time when the field was updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
