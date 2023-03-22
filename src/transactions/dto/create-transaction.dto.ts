import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class createTransactionDto {
  @ApiProperty({ example: 'newCar', description: 'name' })
  @IsString({ message: 'Должно быть строкой' })
  readonly label: string;
  @ApiProperty({ example: -20, description: 'amount' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly amount: number;
  @ApiProperty({ example: '2023-01-01', description: 'date of transaction' })
  @IsString()
  readonly date: Date;
  @ApiProperty({ example: 'Cars', description: 'transaction category' })
  @IsString({ message: 'Должно быть строкой' })
  readonly categoryLabel: string;
}
