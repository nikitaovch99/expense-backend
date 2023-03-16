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

  @ApiOperation({ summary: 'Create a User' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Get()
  getAll() {
    const users = this.userService.getAllUsers();
    return users;
  }

  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({ status: 200, type: User })
  @Patch()
  @UseGuards(IsAuthenticatedGuard)
  update(
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
    @Session() session: SessionParam,
  ) {
    return this.userService.update(session.passport.user, dto, req);
  }
}
