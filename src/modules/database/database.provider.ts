import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pgPromise from 'pg-promise';
import { Logger } from '@nestjs/common';
import { AllConfigType } from '@config/config.type';

const logger = new Logger('DatabaseConnection');

const pgp = pgPromise({
  error: (err) => {
    logger.error(`Database Error: ${err.message || err}`, err.stack);
  },
});

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService<AllConfigType>) => {
    const dbConfig = configService.getOrThrow('database', { infer: true });

    const connection = pgp({
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.name,
      user: dbConfig.username,
      password: dbConfig.password,
    });

    const maxRetries = 5;
    const retryDelay = 2000;

    // Test the connection
    for (let attempt = 1; attempt < maxRetries; attempt++) {
      try {
        await connection.connect();
        logger.log(
          `Successfully connected to PostgreSQL: ${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`,
        );

        // Run a simple query to fully validate connection
        const serverVersion = await connection.one('SELECT version()');
        logger.log(`PostgreSQL server version: ${serverVersion.version}`);

        return connection;
      } catch (error) {
        if (attempt < maxRetries) {
          logger.log(`Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          logger.error(
            `Failed to connect to PostgreSQL after ${maxRetries} attempts`,
            error.stack,
          );
          throw error;
        }
      }
    }
  },
};
