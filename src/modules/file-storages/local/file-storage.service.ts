import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from '@modules/api/file/file.repository';
import { AllConfigType } from '@config/config.type';
import { AppConfig } from '@config/app.config.type';

@Injectable()
export class FileStorageLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileUploadRepo: FileRepository,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    const appConfig = this.configService.get<AppConfig>('app');

    const filePath = `/${appConfig.apiPrefix}/v${appConfig.apiVersion}/${file.path}`;
    const fileRecord = await this.fileUploadRepo.create({
      path: filePath,
    });

    return {
      message: 'File uploaded successfully',
      file: {
        file_id: fileRecord.file_id,
        path: fileRecord.path,
      },
    };
  }
}
