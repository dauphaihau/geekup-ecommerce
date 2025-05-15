import { BaseEntity } from '@common/base.entity';

export class ProductVariantEntity extends BaseEntity {
  variant_id: string;
  product_id: string;
  sku: string;
  price: number;
  size: string;
  color: string;
  image_url: string;
  stock_quantity: number;
}
