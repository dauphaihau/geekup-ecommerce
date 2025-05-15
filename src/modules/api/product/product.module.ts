import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRepository } from '@modules/api/product/repositories/product.repository';
import { ProductController } from '@modules/api/product/product.controller';
import { ProductVariantRepository } from '@modules/api/product/repositories/product-variant.repository';
import { InventoryRepository } from '@modules/api/product/repositories/inventory.repository';

@Module({
  providers: [
    ProductService,
    ProductRepository,
    ProductVariantRepository,
    InventoryRepository,
  ],
  controllers: [ProductController],
  exports: [ProductService, ProductVariantRepository, InventoryRepository],
})
export class ProductModule {}
