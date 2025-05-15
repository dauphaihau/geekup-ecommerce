import { Module, Global, Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisConfigType } from '@modules/redis/config/redis-config.type';

const logger = new Logger('RedisModule');

export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const redisConfig = config.get<RedisConfigType>('redis');

    const redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
    });

    try {
      await redis.ping(); // lightweight command to check connection
      logger.log('Successfully connected to Redis');
    } catch (error) {
      logger.error('Failed to connect to Redis', error);
      throw new Error('Unable to connect to Redis');
    } finally {
      redis.disconnect();
    }
    return redis;
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
