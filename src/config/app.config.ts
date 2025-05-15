import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Environment } from '../constants/app.constant';
import { AppConfig } from './app.config.type';
import { validateEnv } from '../utils/validate-env';
import { Logger } from '@nestjs/common';

const logger = new Logger('AppConfig');

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  APP_URL: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsBoolean()
  @IsOptional()
  APP_DEBUG: boolean;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  API_VERSION: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_LOG_LEVEL: string;

  @IsString()
  @Matches(
    /^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/,
  )
  @IsOptional()
  APP_CORS_ORIGIN: string;

  @IsPositive()
  THROTTLE_TTL: number;

  @IsPositive()
  THROTTLE_LIMIT: number;
}

export default registerAs<AppConfig>('app', () => {
  logger.log(`Register AppConfig from environment variables`);

  validateEnv(process.env, EnvironmentVariablesValidator);

  const port = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000;

  return {
    nodeEnv: process.env.NODE_ENV || Environment.Local,
    name: process.env.APP_NAME || 'app',
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || '1',
    debug: process.env.APP_DEBUG === 'true',
    logLevel: process.env.APP_LOG_LEVEL || 'warn',
    corsOrigin: getCorsOrigin(),
    throttleTTL: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  };
});

function getCorsOrigin() {
  const corsOrigin = process.env.APP_CORS_ORIGIN;
  if (corsOrigin === 'true') return true;
  if (corsOrigin === '*') return '*';
  if (!corsOrigin || corsOrigin === 'false') return false;

  return corsOrigin.split(',').map((origin) => origin.trim());
}
