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
import { createTransactionDto } from './dto/create-transaction.dto';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { NormalizedTransaction, Transaction } from './transactions.entity';
import { TransactionsService } from './transactions.service';
@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({ status: 201, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Post()
  create(
    @Body() dto: createTransactionDto,
    @Session() session: SessionParam,
  ): Promise<NormalizedTransaction> {
    return this.transactionService.create(dto, session.passport.user);
  }

  @ApiOperation({ summary: 'Get all transactions (for Admins)' })
  @ApiResponse({ status: 200, type: [Transaction] })
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Get('all')
  getAll(): Promise<Transaction[]> {
    return this.transactionService.getAll();
  }

  @ApiOperation({ summary: "Get all user's categories" })
  @ApiResponse({ status: 200, type: [Transaction] })
  @UseGuards(IsAuthenticatedGuard)
  @Get()
  getUserTransactions(
    @Session() session: SessionParam,
  ): Promise<Transaction[]> {
    return this.transactionService.getUserTransactions(session.passport.user);
  }

  @ApiOperation({ summary: 'Get one category by id' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<Transaction> {
    return this.transactionService.getTransactionById(
      +id,
      session.passport.user,
    );
  }

  @ApiOperation({ summary: 'Delete one category' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Patch(':id')
  update(
    @Body() dto: updateTransactionDto,
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<NormalizedTransaction> {
    return this.transactionService.updateTransaction(
      dto,
      +id,
      session.passport.user,
    );
  }

  @ApiOperation({ summary: 'Delete one category' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() session: SessionParam,
  ): Promise<void> {
    return this.transactionService.removeTransaction(
      +id,
      session.passport.user,
    );
  }
}
