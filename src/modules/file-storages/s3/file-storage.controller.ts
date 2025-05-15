import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';
import { FileStorageS3Service } from '@modules/file-storages/s3/file-storage.service';

@ApiTags('File Upload')
@Controller('files')
export class FileStorageS3Controller {
  constructor(private readonly fileUploadS3Service: FileStorageS3Service) {}

  @Post('upload')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.fileUploadS3Service.uploadFile(file);
  }
}
