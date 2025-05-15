import { UserEntity } from '@modules/api/user/user.entity';

interface TokenPayload {
  userId: UserEntity['user_id'];
}

export default TokenPayload;
