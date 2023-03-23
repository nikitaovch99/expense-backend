import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../session-auth/guards/roles/roles-auth.decorator';
import { RolesGuard } from '../session-auth/guards/roles/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NormalizedUser, User } from './users.entity';
import { UsersService } from './users.service';
import { IsAuthenticatedGuard } from '../session-auth/guards/is-authenticated/is-authenticated.guard';
import { Request } from 'express';
import { SessionParam } from '../session-auth/session.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create a User (for Admins)' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users (for Admins)' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Get()
  getAll(): Promise<NormalizedUser[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(IsAuthenticatedGuard)
  @Get(':id')
  getOne(
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<User> {
    return this.userService.getUserById(+id, session.passport.user);
  }

  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  @UseGuards(IsAuthenticatedGuard)
  remove(
    @Param('id') id: string,
    @Session() session: SessionParam,
    @Req() req: Request,
  ): Promise<void> {
    return this.userService.remove(+id, session.passport.user, req);
  }

  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({ status: 200, type: User })
  @Patch(':id')
  @UseGuards(IsAuthenticatedGuard)
  update(
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
    @Session() session: SessionParam,
    @Param('id') id: string,
  ): Promise<NormalizedUser> {
    return this.userService.update(+id, session.passport.user, dto, req);
  }
}
