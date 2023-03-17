import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/transactions.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { UsersModule } from 'src/users/users.module';
import { CategoriesController } from './categories.controller';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, TransactionsService],
  imports: [
    TypeOrmModule.forFeature([Category, Transaction]),
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
