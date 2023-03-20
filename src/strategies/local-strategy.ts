import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../users/users.entity';
import { SessionAuthService } from '../session-auth/session-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: SessionAuthService) {
    super();
  }

  validate(username: string, password: string): Promise<User> {
    return this.authService.validateUser(username, password);
  }
}
