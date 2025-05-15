import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '@app/guards/roles.guard';
import { Roles } from '@app/decorators/roles.decorator';
import { Role } from '@app/constants/role.enum';
import { AdminUserService } from './admin-user.service';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';
import { UserService } from '@modules/api/user/user.service';

@ApiTags('Admin User')
@Roles(Role.Admin)
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Controller()
export class AdminUserController {
  constructor(
    private readonly userService: UserService,
    private readonly adminUserService: AdminUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  createUser(@Body() dto: AdminCreateUserDto) {
    return this.adminUserService.createUser(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Users fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async getAllUsers(@Query() query: PaginationRequestDto) {
    return await this.userService.findWithPagination(query);
  }
}
