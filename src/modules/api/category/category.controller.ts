import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from '@modules/api/product/product.service';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import { CategoryService } from '@modules/api/category/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getProducts(@Query() query: PaginationRequestDto) {
    return this.categoryService.findWithPagination(query);
  }
}
