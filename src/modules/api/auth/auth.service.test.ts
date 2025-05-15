import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@modules/api/user/user.service';
import { AuthRepository } from './auth.repository';
import { RefreshTokenService } from './refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { RegisterDto } from './dto/register.dto';
import { ClsModule } from 'nestjs-cls';
import {
  ClsPluginTransactional,
  NoOpTransactionalAdapter,
} from '@nestjs-cls/transactional';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';
import PostgresErrorCode from '@modules/database/postgres-error-code.enum';
import UserAlreadyExistsException from '@modules/api/user/exceptions/user-already-exists.exception';

describe('AuthService - register', () => {
  let authService: AuthService;
  let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;
  let mockAuthRepo: Partial<Record<keyof AuthRepository, jest.Mock>>;

  const registrationData: RegisterDto = {
    first_name: 'Jane',
    last_name: 'Doe',
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    phone_number: '1234567890',
  };

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
    };
    mockAuthRepo = {
      create: jest.fn(),
    };
    const clientMock = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModule.registerPlugins([
          new ClsPluginTransactional({
            adapter: new NoOpTransactionalAdapter({
              tx: clientMock,
            }),
          }),
        ]),
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: AuthRepository, useValue: mockAuthRepo },
        { provide: RefreshTokenService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: TokenService, useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should register a new user and return FullUserResponseDto', async () => {
    const fakeUser = { user_id: '1', ...registrationData };
    const fakeAuth = {
      email: registrationData.email,
      phone_number: registrationData.phone_number,
    };

    mockUserService.create.mockResolvedValue(fakeUser);
    mockAuthRepo.create.mockResolvedValue(fakeAuth);

    const result = await authService.register(registrationData);

    expect(mockUserService.create).toHaveBeenCalledWith({
      first_name: registrationData.first_name,
      last_name: registrationData.last_name,
      username: registrationData.username,
    });

    expect(mockAuthRepo.create).toHaveBeenCalledWith({
      user_id: fakeUser.user_id,
      email: registrationData.email,
      password_hash: expect.any(String),
      phone_number: registrationData.phone_number,
    });

    expect(result.user).toBeInstanceOf(FullUserResponseDto);
    expect(result.user.email).toEqual(fakeAuth.email);
  });

  it('should throw UserAlreadyExistsException for email conflict', async () => {
    const error = {
      code: PostgresErrorCode.UniqueViolation,
      detail: 'Key (email)=(john@example.com) already exists.',
    };

    mockUserService.create.mockResolvedValue({
      user_id: '1',
      ...registrationData,
    });
    mockAuthRepo.create.mockRejectedValue(error);

    await expect(authService.register(registrationData)).rejects.toThrow(
      new UserAlreadyExistsException(`${registrationData.email} email`),
    );
  });
});