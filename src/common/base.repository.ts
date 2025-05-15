import { Logger } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import { PaginationRequestDto } from './pagination/pagination-request.dto';
import { PaginationResponseDto } from './pagination/pagination-response.dto';

/**
 * Base repository providing common CRUD operations for entities
 */
export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract primaryKey: string;
  protected abstract logger: Logger;

  constructor(protected dbService: DatabaseService) {}

  /**
   * Create multiple entities in a batch operation
   * @param dataItems Array of objects with column values
   * @returns Array of created entities
   */
  async createMany(dataItems: Partial<T>[]): Promise<T[]> {
    // Return empty array if no items provided
    if (!dataItems.length) {
      return [];
    }

    try {
      // Get column names from the first item (assuming all items have same structure)
      const firstItem = dataItems[0];
      const columns = Object.keys(firstItem);

      if (columns.length === 0) {
        return [];
      }

      // Build values portion of the query
      const valuesList = [];
      const params = [];
      let paramCounter = 1;

      for (const item of dataItems) {
        // For each item, create a values placeholder like ($1, $2, $3)
        const itemValues = columns.map((col) => {
          // Handle potentially missing properties in some items
          return item.hasOwnProperty(col) ? `$${paramCounter++}` : 'NULL';
        });

        valuesList.push(`(${itemValues.join(', ')})`);

        // Add actual values to params array
        columns.forEach((col) => {
          if (item.hasOwnProperty(col)) {
            params.push(item[col]);
          }
        });
      }

      const columnsList = columns.join(', ');
      const valuesClause = valuesList.join(', ');

      // Execute the insert query
      return await this.dbService.executeQueryMany<T>(
        `${this.tableName}.createMany`,
        `INSERT INTO ${this.tableName} (${columnsList})
        VALUES
        ${valuesClause}
         RETURNING *`,
        params,
      );
    } catch (error) {
      this.logger.error(
        `Error in ${this.tableName}.createMany: ${error.message}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<T[]> {
    return await this.dbService.executeQueryMany<T>(
      `${this.tableName}.findAll`,
      `SELECT * FROM ${this.tableName}`,
    );
  }

  async findWhere(whereClause: string, params: any[]): Promise<T[]> {
    return await this.dbService.executeQueryMany<T>(
      `${this.tableName}.findWhere`,
      `SELECT * FROM ${this.tableName} WHERE ${whereClause}`,
      params,
    );
  }

  async findById(id: number | string): Promise<T | null> {
    return await this.dbService.executeQuerySingle<T>(
      `${this.tableName}.findById`,
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
      [id],
    );
  }

  async findOne(whereClause: string, params: any[]): Promise<T | null> {
    return await this.dbService.executeQuerySingle<T>(
      `${this.tableName}.findOne`,
      `SELECT * FROM ${this.tableName} WHERE ${whereClause}`,
      params,
    );
  }

  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const columnsList = columns.join(', ');
    const paramsList = columns.map((_, i) => `$${i + 1}`).join(', ');

    return await this.dbService.executeQuerySingle<T>(
      `${this.tableName}.create`,
      `
        INSERT INTO ${this.tableName} (${columnsList})
        VALUES (${paramsList})
        RETURNING *
      `,
      values,
    );
  }

  async updateWhere(whereClause: string, data: Partial<T>): Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

    return await this.dbService.executeNonQuery(
      `${this.tableName}.update`,
      `
          UPDATE ${this.tableName}
          SET ${setClause}
          WHERE ${whereClause}
        `,
      [...values],
    );
  }

  async update(id: number | string, data: Partial<T>): Promise<T | null> {
    const columns = Object.keys(data);
    const values = Object.values(data);

    // Skip update if no columns provided
    if (columns.length === 0) {
      return this.findById(id);
    }

    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

    return await this.dbService.executeQuerySingle<T>(
      `${this.tableName}.update`,
      `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE ${this.primaryKey} = $${columns.length + 1}
            RETURNING *
        `,
      [...values, id],
    );
  }

  async delete(id: number | string): Promise<number> {
    return await this.dbService.executeNonQuery(
      `${this.tableName}.delete`,
      `DELETE
       FROM ${this.tableName}
       WHERE ${this.primaryKey} = $1`,
      [id],
    );
  }

  async count(whereClause?: string, params?: any[]): Promise<number> {
    try {
      const query = whereClause
        ? `SELECT COUNT(*)
           FROM ${this.tableName}
           WHERE ${whereClause}`
        : `SELECT COUNT(*)
           FROM ${this.tableName}`;

      const result = await this.dbService.executeQuerySingle<{ count: string }>(
        `${this.tableName}.count`,
        query,
        params || [],
      );

      return parseInt(result.count, 10);
    } catch (error) {
      this.logger.error(`Error in ${this.tableName}.count: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find entities with pagination
   * @param req Pagination options
   */
  async findWithPagination(
    req: PaginationRequestDto,
  ): Promise<PaginationResponseDto<T>> {
    try {
      const page = Math.max(1, req.page || 1);
      const limit = Math.max(1, Math.min(100, req.limit || 10)); // Cap at 100 items per page
      const offset = (page - 1) * limit;

      // Determine sorting
      const orderBy = req.order_by || this.primaryKey;
      const sort = req.sort || 'asc';

      // Safely sanitize column names to prevent SQL injection
      // This is a simple implementation - in production you might want to validate against known column names
      const safeSortBy = this.sanitizeColumnName(orderBy);
      const safeSortOrder = sort === 'desc' ? 'desc' : 'asc';

      // Execute count query
      const total = await this.count();

      // If no results, return empty paginated result
      if (total === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Calculate total totalPages
      const totalPages = Math.ceil(total / limit);

      // Fetch data for current page
      const data = await this.dbService.executeQueryMany<T>(
        `${this.tableName}.paginate`,
        `SELECT *
         FROM ${this.tableName}
         ORDER BY ${safeSortBy} ${safeSortOrder}
         LIMIT $1 OFFSET $2`,
        [limit, offset],
      );

      // Build pagination metadata
      const meta = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      return { data, meta };
    } catch (error) {
      this.logger.error(
        `Error in ${this.tableName}.findWithPagination: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Find entities with pagination and filtering
   * @param whereClause WHERE clause for filtering
   * @param params Query parameters for WHERE clause
   * @param req Pagination options
   */
  async findWhereWithPagination(
    whereClause: string,
    params: any[],
    req: PaginationRequestDto,
  ): Promise<PaginationResponseDto<T>> {
    try {
      const page = Math.max(1, req.page || 1);
      const limit = Math.max(1, Math.min(100, req.limit || 10));
      const offset = (page - 1) * limit;

      // Determine sorting
      const orderBy = req.order_by || this.primaryKey;
      const sort = req.sort || 'asc';

      // Safely sanitize column names
      const safeSortBy = this.sanitizeColumnName(orderBy);
      const safeSortOrder = sort === 'desc' ? 'desc' : 'asc';

      // Execute count query with filter
      const total = await this.count(whereClause, params);

      // If no results, return empty paginated result
      if (total === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      // Get query parameters for pagination (add after the where clause params)
      const allParams = [...params, limit, offset];

      // Fetch data for current page with filtering
      const data = await this.dbService.executeQueryMany<T>(
        `${this.tableName}.paginateFiltered`,
        `SELECT * FROM ${this.tableName}
         WHERE ${whereClause}
         ORDER BY ${safeSortBy} ${safeSortOrder}
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        allParams,
      );

      // Build pagination metadata
      const meta = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      return { data, meta };
    } catch (error) {
      this.logger.error(
        `Error in ${this.tableName}.findWhereWithPagination: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Simple column name sanitization to prevent SQL injection in ORDER BY clauses
   * This is a basic implementation - in production, you'd want to validate against known column names
   */
  protected sanitizeColumnName(columnName: string): string {
    // Remove anything that's not alphanumeric, underscore, or period (for table.column)
    return columnName.replace(/[^a-zA-Z0-9_\.]/g, '');
  }
}
