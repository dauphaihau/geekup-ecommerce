import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({ example: 'SUMMER2024' })
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Z0-9-_]+$/, {
    message:
      'Code must contain only uppercase letters, numbers, hyphens and underscores',
  })
  code: string;

  @ApiProperty({ example: 'Summer sale discount voucher' })
  @IsString()
  @MaxLength(200)
  description: string;

  @ApiProperty({ enum: ['percentage', 'fixed_amount'], example: 'percentage' })
  @IsEnum(['percentage', 'fixed_amount'])
  discount_type: 'percentage' | 'fixed_amount';

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  discount_value: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  min_order_amount?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  usage_limit?: number;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  expiry_date?: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
