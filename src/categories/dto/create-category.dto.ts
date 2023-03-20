import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class createCategoryDto {
  @ApiProperty({ example: 'Cars', description: 'name' })
  @IsString({ message: 'Должно быть строкой' })
  readonly label: string;
}
