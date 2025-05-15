import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BaseRepository } from '@common/base.repository';
import { ProductEntity } from '@modules/api/product/entities/product.entity';
import { GetProductsDto } from '@modules/api/product/dto/get-products.dto';

@Injectable()
export class ProductRepository extends BaseRepository<ProductEntity> {
  protected tableName = 'products';
  protected primaryKey = 'product_id';
  protected logger = new Logger(ProductRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  /**
   * Retrieves products from the database based on specified query parameters.
   *
   * @param {object} dto - An object containing the query parameters from the URL.
   * Expected properties: page, order_by, sort, category_id, s (search).
   * @returns {Promise<Array>} - A Promise that resolves with an array of product objects.
   * Rejects with an error if the database query fails.
   */
  async getProducts(dto: GetProductsDto) {
    try {
      const page = Math.max(1, dto.page || 1);
      const safeOrderBy = this.sanitizeColumnName(
        dto.order_by || this.primaryKey,
      );
      const safeSort = dto.sort === 'desc' ? 'desc' : 'asc';
      const categoryId = dto.category_id;
      const searchString = dto.s;
      const minPrice = dto.min;
      const maxPrice = dto.max;
      const limit = Math.max(1, Math.min(100, dto.limit || 10));
      const offset = (page - 1) * limit;

      let sql = `
            SELECT
                p.product_id,
                p.product_name,
                p.description,
                c.category_name,
                p.created_at,
                p.updated_at,
                pv.stock_quantity,
                pv.price,
                pv.variant_id
            FROM
                products p
            JOIN
                categories c ON p.category_id = c.category_id
            LEFT JOIN
                product_variants pv ON p.product_id = pv.product_id
            WHERE 1=1 -- Start with a condition that is always true
        `;
      const params = [];

      if (categoryId) {
        sql += ` AND p.category_id = $${params.length + 1}`;
        params.push(categoryId);
      }
      if (minPrice) {
        sql += ` AND pv.price >= $${params.length + 1}`;
        params.push(minPrice);
      }
      if (maxPrice) {
        sql += ` AND pv.price <= $${params.length + 1}`;
        params.push(maxPrice);
      }
      if (searchString) {
        sql += ` AND p.product_name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1}`;
        params.push(`%${searchString}%`);
      }

      const countSql = sql.replace(
        /SELECT\s+[\s\S]*?\s+FROM/,
        'SELECT COUNT(*) FROM',
      );
      const countParams = [...params];

      sql += `
            ORDER BY
                ${safeOrderBy} ${safeSort}
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
        `;
      params.push(limit, offset);

      const products = await this.dbService.executeQueryMany(
        'count products',
        sql,
        params,
      );
      const result = await this.dbService.executeQuerySingle<{ count: string }>(
        'count',
        countSql,
        countParams,
      );
      const total = parseInt(result.count, 10);
      const totalPages = Math.ceil(total / limit);

      const meta = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      return { data: products, meta };
    } catch (error) {
      throw error;
    }
  }
}
