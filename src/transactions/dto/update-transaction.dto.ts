import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/categories.entity';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class updateTransactionDto {
  @ApiProperty({ example: 'newCar', description: 'name' })
  @IsString({ message: 'Должно быть строкой' })
  readonly label?: string;
  @ApiProperty({ example: -20, description: 'amount' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly amount?: number;
  @ApiProperty({ example: '2023-01-01', description: 'date of transaction' })
  @IsDate({ message: 'Формат даты должен быть YYYY-MM-DD' })
  readonly date?: Date;
  @ApiProperty({ example: Category, description: 'category' })
  @IsString({ message: 'Должно быть строкой' })
  readonly category?: Category;
}
