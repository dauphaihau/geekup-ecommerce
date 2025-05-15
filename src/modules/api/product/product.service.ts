import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@modules/api/product/repositories/product.repository';
import { GetProductsDto } from '@modules/api/product/dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async findWithPagination(dto: GetProductsDto) {
    return await this.productRepo.getProducts(dto);
  }
}
