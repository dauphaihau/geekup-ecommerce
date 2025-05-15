import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from '@modules/api/product/product.service';
import { GetProductsDto } from '@modules/api/product/dto/get-products.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: GetProductsDto) {
    return this.productService.findWithPagination(query);
  }
}
