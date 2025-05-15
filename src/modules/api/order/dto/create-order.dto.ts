import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  shipping_address_id: string;

  @IsNotEmpty()
  @IsUUID()
  payment_method_id: string;
}
