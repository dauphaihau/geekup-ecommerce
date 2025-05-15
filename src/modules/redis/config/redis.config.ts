import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { validateEnv } from '@app/utils/validate-env';
import { RedisConfigType } from './redis-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_PORT: number;
}

export default registerAs<RedisConfigType>('redis', () => {
  validateEnv(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  };
});
