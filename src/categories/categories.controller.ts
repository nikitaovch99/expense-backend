import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionPassport } from 'src/session-auth/session.decorator';
import { IsAuthenticatedGuard } from '../session-auth/guards/is-authenticated/is-authenticated.guard';
import { Roles } from '../session-auth/guards/roles/roles-auth.decorator';
import { RolesGuard } from '../session-auth/guards/roles/roles.guard';
import { Category, NormalizedCategory } from './categories.entity';
import { CategoriesService } from './categories.service';
import { createCategoryDto } from './dto/create-category.dto';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ status: 201, type: Category })
  @UseGuards(IsAuthenticatedGuard)
  @Post()
  create(
    @Body() dto: createCategoryDto,
    @SessionPassport() username: string,
  ): Promise<NormalizedCategory> {
    return this.categoryService.createCategory(dto, username);
  }

  @ApiOperation({ summary: 'Get all categories (for Admins)' })
  @ApiResponse({ status: 200, type: [Category] })
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Get('all')
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Get all users categories' })
  @ApiResponse({ status: 200, type: [Category] })
  @UseGuards(IsAuthenticatedGuard)
  @Get()
  getUserCategories(@SessionPassport() username: string): Promise<Category[]> {
    return this.categoryService.getAllUserCategories(username);
  }

  @ApiOperation({ summary: 'Get one category by id' })
  @ApiResponse({ status: 200, type: Category })
  @UseGuards(IsAuthenticatedGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @SessionPassport() username: string,
  ): Promise<Category> {
    return this.categoryService.getCategoryById(+id, username);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: Category })
  @UseGuards(IsAuthenticatedGuard)
  @Patch(':id')
  update(
    @Body('label') label: string,
    @Param('id') id: string,
    @SessionPassport() username: string,
  ): Promise<NormalizedCategory> {
    return this.categoryService.updateCategory(label, +id, username);
  }

  @ApiOperation({ summary: 'Delete one category' })
  @ApiResponse({ status: 200 })
  @UseGuards(IsAuthenticatedGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @SessionPassport() username: string,
  ): Promise<void> {
    return this.categoryService.removeCategory(+id, username);
  }
}
