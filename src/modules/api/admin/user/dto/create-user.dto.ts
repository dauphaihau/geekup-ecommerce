import { Role } from '@app/constants/role.enum';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminCreateUserDto {
  @ApiProperty({ example: 'johndoe1@example.com', type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe1', type: String })
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
  password: string;

  @ApiProperty({ example: [Role.Customer, Role.Admin], type: [String] })
  @IsArray()
  roles: Role[];
}
