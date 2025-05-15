import { BaseEntity } from '@common/base.entity';

export class ProductEntity extends BaseEntity {
  product_id: string;
  category_id: string;
  product_name: string;
  description: string;
}
