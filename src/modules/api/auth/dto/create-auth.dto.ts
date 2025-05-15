import { BaseResponseDto } from '@common/dto/base-response.dto';
import { Exclude } from 'class-transformer';

export class CreateAuthDto {
  user_id: string;
  email: string;
  phone_number: string;
  password_hash: string;
}

export class CreateAuthResponseDto extends BaseResponseDto {
  @Exclude()
  auth_id: string;

  user_id: string;
  email: string;
  phone_number: string;

  @Exclude()
  password_hash: string;

  constructor(data: Partial<CreateAuthResponseDto>) {
    super();
    Object.assign(this, data);
  }
}
