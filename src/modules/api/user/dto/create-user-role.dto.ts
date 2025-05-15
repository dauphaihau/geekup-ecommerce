import { Role } from '@app/constants/role.enum';
import { UserEntity } from '@modules/api/user/user.entity';

export class CreateUserRolesDto {
  user_id: UserEntity['user_id'];
  roles?: Role[];
}
