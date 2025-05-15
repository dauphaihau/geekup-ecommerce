import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Address } from './address.entity';

@Injectable()
export class AddressRepository extends BaseRepository<Address> {
  protected tableName = 'addresses';
  protected primaryKey = 'address_id';
  protected logger = new Logger(AddressRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return this.findWhere('user_id = $1', [userId]);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    // First, unset all default addresses for the user
    await this.updateWhere(
      'user_id = $1',
      { is_default: false } as Partial<Address>,
    );

    // Then set the specified address as default
    await this.update(addressId, { is_default: true } as Partial<Address>);
  }
} 