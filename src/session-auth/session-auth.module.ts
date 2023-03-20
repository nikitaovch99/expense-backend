import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/categories.entity';
import { CategoriesService } from '../categories/categories.service';
import { LocalStrategy } from '../strategies/local-strategy';
import { User } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { SessionAuthController } from './session-auth.controller';
import { SessionAuthService } from './session-auth.service';
import { UserSerializer } from './session-auth.user.serializer';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './session.entity';
import * as passport from 'passport';
import * as session from 'express-session';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transactions.entity';
import { TransactionsService } from '../transactions/transactions.service';
@Module({
  controllers: [SessionAuthController],
  providers: [
    SessionAuthService,
    LocalStrategy,
    UsersService,
    CategoriesService,
    UserSerializer,
    TransactionsService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Category, Session, Transaction]),
    forwardRef(() => UsersModule),
    PassportModule.register({ session: true }),
  ],
  exports: [SessionAuthService],
})
export class SessionAuthModule implements NestModule {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  public express = session({
    cookie: {
      maxAge: Number(process.env.SESSION_TOKEN_MAXAGE),
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new TypeormStore().connect(this.sessionRepository),
  });

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.express, passport.initialize(), passport.session())
      .forRoutes('*');
  }
}
