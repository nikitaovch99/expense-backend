import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';

type serializeDone = (error: Error | null, id: string | null) => void;
type deserializeDone = (
  error: Error | null,
  user?: Promise<User> | null,
) => void;

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: serializeDone) {
    done(null, user.username);
  }

  deserializeUser(username: string, done: deserializeDone) {
    const user = this.usersService.getUserByUsername(username);

    if (!user) {
      return done(
        new Error(
          `Could not deserialize user: user with ${username} could not be found`,
        ),
        null,
      );
    }

    done(null, user);
  }
}
