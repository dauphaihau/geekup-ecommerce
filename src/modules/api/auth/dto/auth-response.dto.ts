import { BaseResponseDto } from '@common/dto/base-response.dto';

export class AuthResponseDto extends BaseResponseDto {
  user_id: string;
  auth_id: string;
  email: string;
  phone_number: string;
  password_hash: string;

  constructor(data: Partial<AuthResponseDto>) {
    super();
    Object.assign(this, data);
  }
}
