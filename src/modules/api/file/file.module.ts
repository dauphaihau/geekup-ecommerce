import { Module } from '@nestjs/common';
import { FileRepository } from '@modules/api/file/file.repository';
import fileConfig from '@modules/api/file/config/file.config';
import {
  FileStorageConfig,
  FileStorageDriver,
} from './config/file-config.type';
import { FileStorageLocalModule } from '@modules/file-storages/local/file-storage.module';
import { FileStorageS3Module } from '@modules/file-storages/s3/file-storage.module';
import { FileStorageS3PresignedModule } from '@modules/file-storages/s3-presigned/file-storage.module';

const UploaderModule =
  (fileConfig() as FileStorageConfig).driver === FileStorageDriver.S3
    ? FileStorageS3Module
    : (fileConfig() as FileStorageConfig).driver ===
        FileStorageDriver.S3_Presigned
      ? FileStorageS3PresignedModule
      : FileStorageLocalModule;

@Module({
  imports: [UploaderModule],
  providers: [FileRepository],
})
export class FileModule {}
