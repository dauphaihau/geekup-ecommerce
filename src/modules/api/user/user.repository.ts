import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '@common/base.repository';
import { UserEntity } from '@modules/api/user/user.entity';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';
import { CreateUserRolesDto } from '@modules/api/user/dto/create-user-role.dto';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  protected tableName = 'users';
  protected primaryKey = 'user_id';
  protected logger = new Logger(UserRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async createManyUserRoles(dto: CreateUserRolesDto) {
    const inClaudeValues = dto.roles.map((role) => `'${role}'`).join(', ');
    return await this.dbService.executeQueryMany(
      'create user roles',
      `
        INSERT INTO user_roles (user_id, role_id)
        SELECT $1, r.role_id
        FROM roles r
        WHERE r.name IN (${inClaudeValues})
      `,
      [dto.user_id, dto.roles],
    );
  }

  async getFullUserById(userId: UserEntity['user_id']) {
    const entity = await this.dbService.executeQuerySingle(
      'get user by id',
      `
        SELECT u.user_id,
               u.username,
               au.password_hash,
               au.email,
               COALESCE(array_agg(DISTINCT r.name) filter(WHERE r.name IS NOT NULL), '{}') AS roles
        FROM users u
               LEFT JOIN user_roles ur ON u.user_id = ur.user_id
               LEFT JOIN roles r ON r.role_id = ur.role_id
               LEFT JOIN authenticates au ON au.user_id = u.user_id
        WHERE u.user_id = $1
        GROUP BY u.user_id, u.username, au.password_hash, au.email
      `,
      [userId],
    );
    return new FullUserResponseDto(entity);
  }

  async getFullUserByIdentifier(identifier: string) {
    const entity = await this.dbService.executeQuerySingle(
      'get user by identifier',
      `
        SELECT u.user_id,
               au.password_hash,
               au.email,
               COALESCE(array_agg(DISTINCT r.name) filter(WHERE r.name IS NOT NULL), '{}') AS roles
        FROM users u
               LEFT JOIN user_roles ur ON u.user_id = ur.user_id
               LEFT JOIN roles r ON r.role_id = ur.role_id
               LEFT JOIN authenticates au ON au.user_id = u.user_id
        WHERE u.username = $1
           OR au.email = $1
           OR au.phone_number = $1
        GROUP BY u.user_id, au.email, u.username, au.password_hash
      `,
      [identifier],
    );
    return new FullUserResponseDto(entity);
  }
}
