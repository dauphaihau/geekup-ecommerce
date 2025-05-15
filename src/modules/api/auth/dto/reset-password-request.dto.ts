import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  // @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;
}
