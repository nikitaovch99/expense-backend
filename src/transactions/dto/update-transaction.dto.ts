import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/categories.entity';

export class updateTransactionDto {
  @ApiProperty({ example: 'newCar', description: 'name' })
  readonly label?: string;
  @ApiProperty({ example: -20, description: 'amount' })
  readonly amount?: number;
  @ApiProperty({ example: '2023-01-01', description: 'date of transaction' })
  readonly date?: Date;
  @ApiProperty({ example: Category, description: 'category' })
  readonly category?: Category;
}
