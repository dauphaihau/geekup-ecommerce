import { Exclude } from 'class-transformer';
import { BaseResponseDto } from '@common/dto/base-response.dto';

export class UserWithAuthRoleResponseDto extends BaseResponseDto {
  first_name: string;
  last_name: string;
  username: string;

  @Exclude()
  password_hash: string;
  email: string;

  roles: string[];
}
