import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/categories.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CategoriesService } from '../categories/categories.service';
import { SessionAuthService } from '../session-auth/session-auth.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transactions.entity';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    UsersService,
    CategoriesService,
    SessionAuthService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Category, Transaction]),
    forwardRef(() => CategoriesModule),
  ],
  exports: [TransactionsService, TransactionsModule],
})
export class TransactionsModule {}
