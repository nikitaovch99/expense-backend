import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NormalizedUser, Role, User } from './users.entity';
import * as bcrypt from 'bcryptjs';
import { Category } from 'src/categories/categories.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import { SessionAuthService } from 'src/session-auth/session-auth.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => CategoriesService))
    private categoryService: CategoriesService,
    @Inject(forwardRef(() => SessionAuthService))
    private authService: SessionAuthService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const category = await this.categoryService.createCategory(
      {
        label: 'Інше',
      },
      dto.username,
    );
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const categories = [category];
    const user = await this.userRepository.save({
      ...dto,
      categories,
      password: hashPassword,
    });
    return user;
  }

  async getAllUsers(): Promise<NormalizedUser[]> {
    const users = await this.userRepository.find({
      relations: ['categories', 'transactions'],
    });
    return users.map(this.normalize);
  }

  async getUserById(id: number, username: string) {
    const requester = await this.getUserByUsernameOrFail(username);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['transactions', 'categories'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (requester.role !== Role.Admin && requester.id !== id) {
      throw new HttpException(
        'You have no access to other users',
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  async remove(id: number, username: string, req: Request): Promise<void> {
    const requester = await this.getUserByUsernameOrFail(username);
    const user = await this.getUserById(id, username);
    if (requester.role === Role.Admin && user.role === Role.Admin) {
      throw new HttpException(
        'You can not delete another Administrator',
        HttpStatus.BAD_REQUEST,
      );
    }

    await Promise.all(
      user.transactions.map(async (transaction) => {
        await this.transactionRepository.remove(transaction);
      }),
    );

    await Promise.all(
      user.categories.map(async (category) => {
        await this.categoryRepository.remove(category);
      }),
    );
    if (requester.id === user.id) {
      await this.authService.logout(req);
    }
    await this.userRepository.remove(user);
  }

  async update(
    id: number,
    username: string,
    { displayName, password, role }: UpdateUserDto,
    req: Request,
  ): Promise<NormalizedUser> {
    const requester = await this.getUserByUsernameOrFail(username);
    const user = await this.getUserById(id, username);

    if (requester.role === Role.Admin && user.role === Role.Admin) {
      throw new HttpException(
        'You can not update another Administrator',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!password && !displayName && !role) {
      throw new HttpException(
        'No parameters were passed',
        HttpStatus.BAD_REQUEST,
      );
    }

    displayName && (user.displayName = displayName);

    if (role && requester.role === Role.Admin) {
      user.role = role;
    }

    if (password) {
      const hashPassword = await bcrypt.hash(password, 5);
      user.password = hashPassword;
      if (id === requester.id) {
        await this.authService.logout(req);
      }
    }

    await this.userRepository.save(user);
    return this.normalize(user);
  }

  async getUserByUsername(username: string): Promise<User> | null {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['categories', 'transactions'],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async getUserByUsernameOrFail(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['categories', 'transactions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  normalize({
    id,
    username,
    displayName,
    role,
    transactions,
    categories,
    createdAt,
    updatedAt,
  }): NormalizedUser {
    return {
      id,
      username,
      displayName,
      role,
      transactions,
      categories,
      createdAt,
      updatedAt,
    };
  }
}
