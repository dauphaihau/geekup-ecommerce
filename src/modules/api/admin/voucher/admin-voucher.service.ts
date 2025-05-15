import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  Voucher,
  VoucherRepository,
} from '@modules/api/voucher/voucher.repository';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import { PaginationResponseDto } from '@common/pagination/pagination-response.dto';

@Injectable()
export class AdminVoucherService {
  constructor(private readonly voucherRepo: VoucherRepository) {}

  async create(createVoucherDto: CreateVoucherDto) {
    // Check if voucher code already exists
    const existingVoucher = await this.voucherRepo.findByCode(
      createVoucherDto.code,
    );
    if (existingVoucher) {
      throw new ConflictException('Voucher code already exists');
    }

    return this.voucherRepo.create(createVoucherDto);
  }

  async findWithPagination(
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<Voucher>> {
    return await this.voucherRepo.findWithPagination(paginationRequestDto);
  }

  async findOne(id: string) {
    const voucher = await this.voucherRepo.findById(id);
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }
    return voucher;
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto) {
    const voucher = await this.voucherRepo.findById(id);
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    // If code is being updated, check if new code already exists
    if (updateVoucherDto.code && updateVoucherDto.code !== voucher.code) {
      const existingVoucher = await this.voucherRepo.findByCode(
        updateVoucherDto.code,
      );
      if (existingVoucher) {
        throw new ConflictException('Voucher code already exists');
      }
    }

    return this.voucherRepo.update(id, updateVoucherDto);
  }

  async remove(id: string) {
    const voucher = await this.voucherRepo.findById(id);
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    await this.voucherRepo.delete(id);
    return { message: 'Voucher deleted successfully' };
  }
}
