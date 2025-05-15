import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from '@common/pagination/pagination-request.dto';
import { PaginationResponseDto } from '@common/pagination/pagination-response.dto';
import { CategoryRepository } from '@modules/api/category/category.repository';
import { CategoryEntity } from '@modules/api/category/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async findWithPagination(
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CategoryEntity>> {
    return await this.categoryRepo.findWithPagination(paginationRequestDto);
  }
}
