import { BadRequestException, Injectable } from '@nestjs/common';
import { FileRepository } from '@modules/api/file/file.repository';

@Injectable()
export class FileStorageS3Service {
  constructor(private readonly fileUploadRepo: FileRepository) {}

  async uploadFile(file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    const fileRecord = await this.fileUploadRepo.create({
      path: file.key,
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
