import { BaseEntity } from '@common/base.entity';

export class UserEntity extends BaseEntity {
  user_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
}
