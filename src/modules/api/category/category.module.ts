import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepository } from '@modules/api/category/category.repository';
import { CategoryController } from '@modules/api/category/category.controller';

@Module({
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
