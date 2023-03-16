import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/categories.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { SessionAuthService } from 'src/session-auth/session-auth.service';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
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
