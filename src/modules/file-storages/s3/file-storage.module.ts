import { BadRequestException, Logger, Module } from '@nestjs/common';
import { FileStorageS3Service } from '@modules/file-storages/s3/file-storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { FileRepository } from '@modules/api/file/file.repository';
import { FileStorageS3Controller } from '@modules/file-storages/s3/file-storage.controller';
import { FileStorageConfig } from '@modules/api/file/config/file-config.type';

const logger = new Logger('FileStorageS3Module');

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const fileConfig = configService.get<FileStorageConfig>('file');

        const s3Client = new S3Client({
          region: fileConfig.awsS3Region,
          credentials: {
            accessKeyId: fileConfig.awsAccessKeyId,
            secretAccessKey: fileConfig.awsSecretAccessKey,
          },
        });

        try {
          const command = new ListObjectsV2Command({
            Bucket: fileConfig.awsS3Bucket,
            MaxKeys: 1,
          });
          await s3Client.send(command);
          logger.log('Successfully connected to AWS S3');
        } catch (error) {
          logger.error('Failed to connect to AWS S3', error);
          throw error;
        }

        return {
          fileFilter: (_request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new BadRequestException('invalid file type'),
                false,
              );
            }
            callback(null, true);
          },
          storage: multerS3({
            s3: s3Client,
            bucket: fileConfig.awsS3Bucket,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_request, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: fileConfig.maxFileSize,
          },
        };
      },
    }),
  ],
  providers: [FileStorageS3Service, FileRepository],
  controllers: [FileStorageS3Controller],
})
export class FileStorageS3Module {}
