import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class GetAverageOrderValueDto {
  @ApiProperty({
    description:
      'Optional start date for the calculation window (format: YYYY)',
    example: '2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'year must be in YYYY format',
  })
  year?: string;
}
