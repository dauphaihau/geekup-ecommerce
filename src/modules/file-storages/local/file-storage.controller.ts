import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageLocalService } from '@modules/file-storages/local/file-storage.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';

@ApiTags('File Upload')
@Controller('files')
export class FileStorageController {
  constructor(private readonly fileUploadService: FileStorageLocalService) {}

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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.uploadFile(file);
  }

  @Get(':path')
  @ApiExcludeEndpoint()
  download(@Param('path') path, @Res() res) {
    return res.sendFile(path, { root: './files' });
  }
}
