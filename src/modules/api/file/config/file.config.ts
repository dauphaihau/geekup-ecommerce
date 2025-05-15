import { registerAs } from '@nestjs/config';

import { IsEnum, IsString, ValidateIf } from 'class-validator';
import {
  FileStorageDriver,
  FileStorageConfig,
} from './file-config.type';
import { validateEnv } from '@app/utils/validate-env';

class EnvironmentVariablesValidator {
  @IsEnum(FileStorageDriver)
  FILE_DRIVER: FileStorageDriver;

  @ValidateIf((envValues) =>
    [FileStorageDriver.S3, FileStorageDriver.S3_Presigned].includes(
      envValues.FILE_DRIVER,
    ),
  )
  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @ValidateIf((envValues) =>
    [FileStorageDriver.S3, FileStorageDriver.S3_Presigned].includes(
      envValues.FILE_DRIVER,
    ),
  )
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @ValidateIf((envValues) =>
    [FileStorageDriver.S3, FileStorageDriver.S3_Presigned].includes(
      envValues.FILE_DRIVER,
    ),
  )
  @IsString()
  AWS_S3_BUCKET: string;

  @ValidateIf((envValues) =>
    [FileStorageDriver.S3, FileStorageDriver.S3_Presigned].includes(
      envValues.FILE_DRIVER,
    ),
  )
  @IsString()
  AWS_S3_REGION: string;
}

export default registerAs<FileStorageConfig>('file', () => {
  validateEnv(process.env, EnvironmentVariablesValidator);

  return {
    driver:
      (process.env.FILE_DRIVER as FileStorageDriver | undefined) ??
      FileStorageDriver.Local,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 5242880, // 5mb
  };
});
