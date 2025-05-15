import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class GetChurnRateCustomersDto {
  @ApiProperty({
    description:
      'Optional start date for the calculation window (format: YYYY-MM-DD)',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'from_date must be in YYYY-MM-DD format',
  })
  from_date?: string;

  @ApiProperty({
    description:
      'Optional end date for the calculation window (defaults to today)',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'to_date must be in YYYY-MM-DD format',
  })
  to_date?: string;

  @ApiProperty({
    description:
      'Optional duration of the window in months (e.g., 6 for 6 months)',
    example: 12,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  window_months?: number;
}
