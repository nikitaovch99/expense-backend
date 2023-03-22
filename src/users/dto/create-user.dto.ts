import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'firstUser', description: 'username' })
  @IsString({ message: 'Должно быть строкой' })
  readonly username: string;
  @ApiProperty({ example: 'first1234', description: 'password' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  readonly password: string;
  @ApiProperty({ example: 'first', description: 'Displayed name' })
  @IsString({ message: 'Должно быть строкой' })
  readonly displayName: string;
}
