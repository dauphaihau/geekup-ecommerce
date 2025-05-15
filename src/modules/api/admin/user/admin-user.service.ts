import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from '@modules/api/user/user.service';
import PostgresErrorCode from '../../../database/postgres-error-code.enum';
import UserAlreadyExistsException from '@modules/api/user/exceptions/user-already-exists.exception';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { AuthService } from '@modules/api/auth/auth.service';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Transactional()
  public async createUser(data: AdminCreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await this.userService.create({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        roles: data.roles,
      });
      await this.authService.create({
        user_id: newUser.user_id,
        email: data.email,
        password_hash: hashedPassword,
        phone_number: data.phone_number,
      });
      return newUser;
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        const detail = error.detail as string;

        if (detail.includes('(email)')) {
          throw new UserAlreadyExistsException(`${data.email} email`);
        }
        if (detail.includes('(phone_number)')) {
          throw new UserAlreadyExistsException(
            `${data.phone_number} phone number`,
          );
        }
        throw new ConflictException('Unique constraint violation');
      }
      throw error;
    }
  }
}
