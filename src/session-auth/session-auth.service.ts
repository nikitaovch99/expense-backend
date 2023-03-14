import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';

@Injectable()
export class SessionAuthService {
  constructor(private userService: UsersService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    const passwordEquals = await bcrypt.compare(password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Incorrect username or password',
    });
  }
  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByUsername(
      userDto.username,
    );
    if (candidate) {
      throw new HttpException(
        'This username already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.createUser(userDto);
    return user;
  }

  async logout(request: Request) {
    const logoutError = await new Promise((resolve) =>
      request.logOut({ keepSessionInfo: false }, (error) => resolve(error)),
    );

    if (logoutError) {
      throw new InternalServerErrorException('Could not log out user');
    }

    return {
      logout: true,
    };
  }
}
