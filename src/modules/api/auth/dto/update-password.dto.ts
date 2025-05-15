import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {
    message:
      'password must be at least 8 characters long and include upper case, lower case, number, and special character',
  })
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  token: string;
}
