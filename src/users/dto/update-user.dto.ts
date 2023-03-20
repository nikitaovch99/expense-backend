import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../users.entity';
import { IsString, Length, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'first1234', description: 'password' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  @IsOptional()
  readonly password?: string;
  @ApiProperty({ example: 'first', description: 'Displayed name' })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  readonly displayName?: string;
  @ApiProperty({ example: 'USER', description: 'role', enum: Role })
  @IsEnum(Role, { message: 'Значение должно быть ADMIN или USER' })
  @IsOptional()
  readonly role?: Role;
}
