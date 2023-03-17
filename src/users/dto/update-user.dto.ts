import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../users.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'first1234', description: 'password' })
  readonly password: string;
  @ApiProperty({ example: 'first', description: 'Displayed name' })
  readonly displayName: string;
  @ApiProperty({ example: 'USER', description: 'role' })
  readonly role: Role;
}
