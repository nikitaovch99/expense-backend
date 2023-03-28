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
    @SessionPassport() username: string,
  ): Promise<NormalizedTransaction> {
    return this.transactionService.create(dto, username);
  }

  @ApiOperation({ summary: 'Get all transactions (for Admins)' })
  @ApiResponse({ status: 200, type: [Transaction] })
  @Roles('ADMIN')
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Get('all')
  getAll(): Promise<Transaction[]> {
    return this.transactionService.getAll();
  }

  @ApiOperation({ summary: "Get all user's transactions" })
  @ApiResponse({ status: 200, type: [Transaction] })
  @UseGuards(IsAuthenticatedGuard)
  @Get()
  getUserTransactions(
    @SessionPassport() username: string,
  ): Promise<Transaction[]> {
    return this.transactionService.getUserTransactions(username);
  }

  @ApiOperation({ summary: 'Get one category by id' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @SessionPassport() username: string,
  ): Promise<Transaction> {
    return this.transactionService.getTransactionById(+id, username);
  }

  @ApiOperation({ summary: 'Delete one category' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Patch(':id')
  update(
    @Body() dto: updateTransactionDto,
    @Param('id') id: string,
    @SessionPassport() username: string,
  ): Promise<NormalizedTransaction> {
    return this.transactionService.updateTransaction(dto, +id, username);
  }

  @ApiOperation({ summary: 'Delete one category' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(IsAuthenticatedGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @SessionPassport() username: string,
  ): Promise<void> {
    return this.transactionService.removeTransaction(+id, username);
  }
}
