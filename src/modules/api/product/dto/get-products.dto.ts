import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import { IsEnum, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto extends PaginationRequestDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  // @IsOptional()
  // @IsUUID()
  // store_id?: string;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  min?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  max?: number;

  @IsOptional()
  @IsString()
  s?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['product_name', 'price', 'created_at'])
  order_by?: 'product_name' | 'price' | 'created_at';
}
