import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from 'src/session-auth/guards/is-authenticated/is-authenticated.guard';
import { Roles } from 'src/session-auth/guards/roles/roles-auth.decorator';
import { RolesGuard } from 'src/session-auth/guards/roles/roles.guard';
import { SessionParam } from 'src/session-auth/session.entity';
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
    @Session() session: SessionParam,
  ): Promise<NormalizedCategory> {
    return this.categoryService.createCategory(dto, session.passport.user);
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
  getUserCategories(@Session() session: SessionParam): Promise<Category[]> {
    return this.categoryService.getAllUserCategories(session.passport.user);
  }

  @ApiOperation({ summary: 'Get one category by id' })
  @ApiResponse({ status: 200, type: Category })
  @UseGuards(IsAuthenticatedGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<Category> {
    const category = this.categoryService.getCategoryById(
      +id,
      session.passport.user,
    );
    return category;
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: Category })
  @UseGuards(IsAuthenticatedGuard)
  @Patch(':id')
  update(
    @Body('label') label: string,
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<NormalizedCategory> {
    return this.categoryService.updateCategory(
      label,
      +id,
      session.passport.user,
    );
  }

  @ApiOperation({ summary: 'Delete one category' })
  @ApiResponse({ status: 200 })
  @UseGuards(IsAuthenticatedGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<void> {
    return this.categoryService.removeCategory(+id, session.passport.user);
  }
}
