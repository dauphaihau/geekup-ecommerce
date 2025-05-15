import { BaseEntity } from '@common/base.entity';
import { Exclude } from 'class-transformer';
import { UserEntity } from '@modules/api/user/user.entity';

export class AuthEntity extends BaseEntity {
  auth_id: string;
  user_id: UserEntity['user_id'];
  email: string;
  phone_number: string;

  @Exclude()
  password_hash: string;
}
