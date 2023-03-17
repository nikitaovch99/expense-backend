import { ApiProperty } from '@nestjs/swagger';

export class createCategoryDto {
  @ApiProperty({ example: 'Cars', description: 'name' })
  readonly label: string;
}
