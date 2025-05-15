import { Exclude } from 'class-transformer';
import { UserEntity } from '@modules/api/user/user.entity';

export class FullUserResponseDto extends UserEntity {
  roles: string[];

  @Exclude()
  auth_id: string;

  @Exclude()
  password_hash: string;

  constructor(data: Partial<FullUserResponseDto>) {
    super();
    Object.assign(this, data);
  }
}
