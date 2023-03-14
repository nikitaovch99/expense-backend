import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/categories.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { LocalStrategy } from 'src/strategies/local-strategy';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { SessionAuthController } from './session-auth.controller';
import { SessionAuthService } from './session-auth.service';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import { UserSerializer } from './session-auth.user.serializer';

@Module({
  controllers: [SessionAuthController],
  providers: [
    SessionAuthService,
    LocalStrategy,
    UsersService,
    CategoriesService,
    UserSerializer,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    UsersModule,
    PassportModule.register({ session: true }),
  ],
})
export class SessionAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        expressSession({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
        }),
        passport.session(),
      )
      .forRoutes('*');
  }
}
