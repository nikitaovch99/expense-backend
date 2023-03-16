import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'firstUser', description: 'username' })
  readonly username: string;
  @ApiProperty({ example: 'first1234', description: 'password' })
  readonly password: string;
  @ApiProperty({ example: 'first', description: 'Displayed name' })
  readonly displayName: string;
  @ApiProperty({ description: 'array of categories' })
  readonly categories: [];
  @ApiProperty({ description: 'array of transactions' })
  readonly transactions: [];
}
