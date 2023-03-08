import { Transaction } from 'src/transactions/transactions.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  label!: string;

  @ManyToOne(() => User, (user) => user.categories)
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
