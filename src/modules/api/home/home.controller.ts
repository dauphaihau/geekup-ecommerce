import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('/')
export class HomeController {
  @Get()
  @ApiExcludeEndpoint()
  home() {
    return 'Welcome to the API';
  }
}
