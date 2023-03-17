import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'first1234', description: 'password' })
  readonly password: string;
  @ApiProperty({ example: 'first', description: 'Displayed name' })
  readonly displayName: string;
}
