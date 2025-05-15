import { BaseEntity } from '@common/base.entity';

export class CategoryEntity extends BaseEntity {
  category_name: string;
  category_id: string;
  description: string;
}
