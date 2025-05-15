import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';

export interface PaymentMethod {
  payment_method_id: string;
  method_name: string;
}

export interface PaymentTransaction {
  transaction_id: string;
  order_id: string;
  payment_method_id: string;
  transaction_date: Date;
  amount: number;
  status: string;
  transaction_reference: string;
  failure_reason?: string;
}

@Injectable()
export class PaymentTransactionRepository extends BaseRepository<PaymentTransaction> {
  protected tableName = 'payment_transactions';
  protected primaryKey = 'transaction_id';
  protected logger = new Logger(PaymentTransactionRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findByReference(reference: string): Promise<PaymentTransaction | null> {
    return this.findOne('transaction_reference = $1', [reference]);
  }
}

@Injectable()
export class PaymentMethodRepository extends BaseRepository<PaymentMethod> {
  protected tableName = 'payment_methods';
  protected primaryKey = 'payment_method_id';
  protected logger = new Logger(PaymentMethodRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
