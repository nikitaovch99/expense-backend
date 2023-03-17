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
import { Roles } from 'src/session-auth/guards/roles/roles-auth.decorator';
import { RolesGuard } from 'src/session-auth/guards/roles/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { IsAuthenticatedGuard } from 'src/session-auth/guards/is-authenticated/is-authenticated.guard';
import { Request } from 'express';
import { SessionParam } from 'src/session-auth/session.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create a User (for Admins)' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users (for Admins)' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Get()
  getAll() {
    const users = this.userService.getAllUsers();
    return users;
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(IsAuthenticatedGuard)
  @Get(':id')
  getOne(@Param('id') id: string, @Session() session: SessionParam) {
    const user = this.userService.getUserById(+id, session.passport.user);
    return user;
  }

  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  @UseGuards(IsAuthenticatedGuard)
  remove(
    @Param('id') id: string,
    @Session() session: SessionParam,
    @Req() req: Request,
  ) {
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
  ) {
    return this.userService.update(+id, session.passport.user, dto, req);
  }
}
