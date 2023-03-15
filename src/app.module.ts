import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Category } from './categories/categories.entity';
import { Transaction } from './transactions/transactions.entity';
import { Session } from './session-auth/session.entity';
import { SessionAuthModule } from './session-auth/session-auth.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Category, Transaction, Session],
      synchronize: process.env.NODE_ENV === 'development' ? true : false,
    }),
    UsersModule,
    CategoriesModule,
    TransactionsModule,
    SessionAuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
