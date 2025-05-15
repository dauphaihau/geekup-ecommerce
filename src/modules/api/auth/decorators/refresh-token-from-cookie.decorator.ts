import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenDto } from '@modules/api/auth/dto/refresh-token.dto';

// Custom decorator to pull cookie and validate it as DTO
export const RefreshTokenFromCookie = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const dto = plainToInstance(RefreshTokenDto, {
      refreshToken: request.cookies?.refreshToken,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return dto.refreshToken;
  },
);
