import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/categories.entity';
import { CategoriesModule } from '../categories/categories.module';
import { SessionAuthModule } from '../session-auth/session-auth.module';
import { Transaction } from '../transactions/transactions.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Category, Transaction]),
    forwardRef(() => CategoriesModule),
    TransactionsModule,
    forwardRef(() => SessionAuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
