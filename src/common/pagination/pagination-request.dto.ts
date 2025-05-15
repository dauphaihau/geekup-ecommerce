import {
  IsOptional,
  IsString,
  IsIn,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  order_by?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc' = 'asc';
}
