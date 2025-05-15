import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './address.entity';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import { PaginationResponseDto } from '@common/pagination/pagination-response.dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepository) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = await this.addressRepo.create(createAddressDto);
    if (createAddressDto.is_default) {
      await this.addressRepo.setDefaultAddress(
        createAddressDto.user_id,
        address.address_id,
      );
    }
    return address;
  }

  async findAll(
    paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<Address>> {
    return this.addressRepo.findWithPagination(paginationDto);
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepo.findById(id);
    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }
    return address;
  }

  async findByUserId(
    userId: string,
    paginationDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<Address>> {
    return this.addressRepo.findWhereWithPagination(
      'user_id = $1',
      [userId],
      paginationDto,
    );
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepo.update(id, updateAddressDto);
    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }

    if (updateAddressDto.is_default) {
      await this.addressRepo.setDefaultAddress(address.user_id, id);
    }

    return address;
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepo.delete(id);
    if (result === 0) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }
  }
} 