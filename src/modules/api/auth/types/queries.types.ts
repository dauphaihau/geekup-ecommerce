import { AuthEntity } from '../auth.entity';

export type IGetByUserId = Pick<
  AuthEntity,
  'user_id' | 'email' | 'password_hash'
>;
