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

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string;

  @CreateDateColumn()
  date!: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  amount!: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user!: User;

  @ManyToOne(() => Category, (category) => category.transactions)
  category?: Category;
}
