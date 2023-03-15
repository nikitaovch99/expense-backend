import {
  Body,
  Controller,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { SessionAuthService } from './session-auth.service';
import { Session as ExpressSession } from 'express-session';
import { IsAuthenticatedGuard } from './guards/is-authenticated/is-authenticated.guard';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

@ApiTags('Session-Authorization')
@Controller('session-auth')
export class SessionAuthController {
  constructor(private authService: SessionAuthService) {}

  @ApiOperation({ summary: 'Log in a User' })
  @ApiResponse({ status: 200 })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Session() session: ExpressSession) {
    return session;
  }
  @ApiOperation({ summary: 'Register a User' })
  @ApiResponse({ status: 201, type: User })
  @Post('registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
  @ApiOperation({ summary: 'Logout a User' })
  @ApiResponse({ status: 200 })
  @UseGuards(IsAuthenticatedGuard)
  @Post('logout')
  async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
