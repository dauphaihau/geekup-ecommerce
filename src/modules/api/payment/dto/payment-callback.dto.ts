import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class PaymentCallbackDto {
  @IsNotEmpty()
  @IsString()
  transaction_reference: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['successful', 'failed'])
  status: 'successful' | 'failed';

  @IsString()
  failure_reason?: string;
}
