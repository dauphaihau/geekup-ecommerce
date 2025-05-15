import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';
import { CurrentUser } from '@app/decorators/current-user.decorator';

@Controller('addresses')
@UseGuards(JwtAuthenticationGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser('user_id') userId: string,
  ) {
    return this.addressService.create({ ...createAddressDto, user_id: userId });
  }

  @Get()
  findAll(@Query() paginationDto: PaginationRequestDto) {
    return this.addressService.findAll(paginationDto);
  }

  @Get('user/:userId')
  findByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationRequestDto,
  ) {
    return this.addressService.findByUserId(userId, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressService.remove(id);
  }
}
