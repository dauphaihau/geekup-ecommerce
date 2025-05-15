import { IsNotEmpty, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  order_id: string;
} 