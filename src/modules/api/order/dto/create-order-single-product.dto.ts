import { IsString, IsUUID, IsInt, Min, IsOptional, IsArray } from 'class-validator';

export class CreateOrderSingleProductDto {
  @IsUUID()
  shipping_address_id: string;

  @IsUUID()
  payment_method_id: string;

  @IsUUID()
  variant_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  voucher_codes?: string[];
}
