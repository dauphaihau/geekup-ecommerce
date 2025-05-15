import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';
import ms from 'ms';
import { validateEnv } from '@app/utils/validate-env';

class EnvironmentVariablesValidator {
  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  RESET_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateEnv(process.env, EnvironmentVariablesValidator);

  return {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: ms(
      process.env.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
    ),
    refreshTokenExpiresIn: ms(
      process.env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
    ),
    resetTokenExpires: process.env.RESET_TOKEN_EXPIRES_IN as ms.StringValue,
  };
});
