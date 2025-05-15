import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AdminVoucherService } from './admin-voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { Roles } from '@app/decorators/roles.decorator';
import { Role } from '@app/constants/role.enum';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';

@ApiTags('Admin Voucher')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.Admin)
@Controller()
export class AdminVoucherController {
  constructor(private readonly adminVoucherService: AdminVoucherService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Voucher created successfully' })
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.adminVoucherService.create(createVoucherDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all vouchers' })
  findAll(@Query() query: PaginationRequestDto) {
    return this.adminVoucherService.findWithPagination(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the voucher' })
  findOne(@Param('id') id: string) {
    return this.adminVoucherService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Voucher updated successfully' })
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.adminVoucherService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Voucher deleted successfully' })
  remove(@Param('id') id: string) {
    return this.adminVoucherService.remove(id);
  }
}
