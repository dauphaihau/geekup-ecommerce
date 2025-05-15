import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe@example.com', type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe', type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '1234567890', type: String })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ example: 'John', type: String })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'Password123.', type: String })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {
    message:
      'password must be at least 8 characters long and include upper case, lower case, number, and special character',
  })
  password: string;
}
