import { registerAs } from '@nestjs/config';

import { IsInt, Min, Max, IsString, ValidateIf } from 'class-validator';
import { validateEnv } from '@app/utils/validate-env';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DB_HOST: string;

  @ValidateIf((envValues) => !envValues.DB_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @ValidateIf((envValues) => !envValues.DB_URL)
  @IsString()
  DB_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.DB_URL)
  @IsString()
  DB_NAME: string;

  @ValidateIf((envValues) => !envValues.DB_URL)
  @IsString()
  DB_USERNAME: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateEnv(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  };
});
