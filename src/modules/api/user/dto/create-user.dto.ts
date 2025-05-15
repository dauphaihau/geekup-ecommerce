import { Role } from '@app/constants/role.enum';

export class CreateUserDto {
  first_name: string;
  last_name: string;
  username: string;
  roles?: Role[];
}
