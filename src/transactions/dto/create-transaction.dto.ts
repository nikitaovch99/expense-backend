import { ApiProperty } from '@nestjs/swagger';

export class createTransactionDto {
  @ApiProperty({ example: 'newCar', description: 'name' })
  readonly label: string;
  @ApiProperty({ example: -20, description: 'amount' })
  readonly amount: number;
  @ApiProperty({ example: '2023-01-01', description: 'date of transaction' })
  readonly date: Date;
  @ApiProperty({ example: 'Cars', description: 'transaction category' })
  readonly categoryLabel: string;
}
