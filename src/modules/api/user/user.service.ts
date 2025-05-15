import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import UserAlreadyExistsException from './exceptions/user-already-exists.exception';
import { CreateUserDto } from './dto/create-user.dto';
import PostgresErrorCode from '../../database/postgres-error-code.enum';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import { PaginationResponseDto } from '@common/pagination/pagination-response.dto';
import { UserEntity } from '@modules/api/user/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getFullUserByIdentifier(identifier: string) {
    const user = await this.userRepo.getFullUserByIdentifier(identifier);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getFullUserById(userId: UserEntity['user_id']) {
    const user = await this.userRepo.getFullUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    try {
      const { roles, ...resUserDto } = userDto;
      const userEntity = await this.userRepo.create(resUserDto);
      if (roles?.length > 0) {
        await this.userRepo.createManyUserRoles({
          user_id: userEntity.user_id,
          roles: userDto.roles,
        });
      }
      return userEntity;
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new UserAlreadyExistsException(`${userDto.username} username`);
      }
      throw error;
    }
  }

  async findWithPagination(
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<UserEntity>> {
    return await this.userRepo.findWithPagination(paginationRequestDto);
  }
}
