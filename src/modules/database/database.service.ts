import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DATABASE_CONNECTION } from '@modules/database/database.provider';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>,
    @Inject(DATABASE_CONNECTION) private db: IDatabase<any>,
  ) {}

  /**
   * Execute a query with logging
   * @param name Identifier for the query (for logging)
   * @param query SQL query string
   * @param params Query parameters
   * @returns Query result
   */
  async executeQuery<T>(
    name: string,
    query: string,
    params: any[] = [],
  ): Promise<T[]> {
    this.logger.debug(
      `Executing query "${name}": ${this.formatQuery(query, params)}`,
    );
    const startTime = Date.now();

    try {
      const result = await this.db.any<T>(query, params);
      const duration = Date.now() - startTime;

      this.logger.debug(`Query "${name}" completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Query "${name}" failed after ${duration}ms: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Execute a query that must return exactly one row
   */
  async executeQuerySingle<T>(
    name: string,
    query: string,
    params: any[] = [],
  ): Promise<T> {
    const { tx } = this.txHost; // Get current transaction or db

    this.logger.debug(
      `Executing query "${name}" (one): ${this.formatQuery(query, params)}`,
    );
    const startTime = Date.now();

    try {
      const result = await tx.oneOrNone<T>(query, params);
      const duration = Date.now() - startTime;

      this.logger.debug(`Query "${name}" completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Query "${name}" failed after ${duration}ms: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Execute a query that doesn't return any data (INSERT, UPDATE, DELETE)
   * @returns Number of rows affected
   */
  async executeNonQuery(
    name: string,
    query: string,
    params: any[] = [],
  ): Promise<number> {
    const { tx } = this.txHost; // Get current transaction or db
    this.logger.debug(
      `Executing non-query "${name}": ${this.formatQuery(query, params)}`,
    );
    const startTime = Date.now();

    try {
      const result = await tx.result(query, params);
      const duration = Date.now() - startTime;

      this.logger.debug(
        `Non-query "${name}" completed in ${duration}ms, affected ${result.rowCount} rows`,
      );
      return result.rowCount;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Non-query "${name}" failed after ${duration}ms: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Execute a query that returns none or many rows
   */
  async executeQueryMany<T>(
    name: string,
    query: string,
    params: any[] = [],
  ): Promise<T[]> {
    const { tx } = this.txHost; // Get current transaction or db

    this.logger.debug(
      `Executing query "${name}" (any): ${this.formatQuery(query, params)}`,
    );
    const startTime = Date.now();

    try {
      const result = await tx.any(query, params);
      const duration = Date.now() - startTime;

      this.logger.debug(
        `Query "${name}" completed in ${duration}ms, returned ${result.length} rows`,
      );
      return result as T[];
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Query "${name}" failed after ${duration}ms: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Format query with parameters for logging (simplified version)
   */
  private formatQuery(query: string, params: any[]): string {
    if (!params || params.length === 0) {
      return query;
    }

    // In production, you might want to limit this or redact sensitive data
    return `${query} [Params: ${JSON.stringify(params)}]`;
  }

  async onApplicationShutdown(signal: string) {
    this.logger.log(
      `Shutting down database connection due to signal: ${signal}`,
    );
    try {
      // Terminate pg-promise connection pool
      await this.db.$pool.end(); // .end() for native pg Pool
      this.logger.log('Database connection pool has been closed');
    } catch (error) {
      this.logger.error('Error while closing database connection', error.stack);
    }
  }
}
