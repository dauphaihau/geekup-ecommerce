import { BaseEntity } from '@common/base.entity';
import { UserEntity } from '@modules/api/user/user.entity';

export class RefreshTokenEntity extends BaseEntity {
  user_id: UserEntity['user_id'];
  token_hash: string;
  revoked: boolean;
  expires_at: Date;
}
