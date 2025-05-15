import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileStorageLocalService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { FileRepository } from '@modules/api/file/file.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@config/config.type';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
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
          storage: diskStorage({
            destination: './files',
            filename: (_request, file, callback) => {
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
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  providers: [FileStorageLocalService, FileRepository],
  controllers: [FileStorageController],
})
export class FileStorageLocalModule {}
