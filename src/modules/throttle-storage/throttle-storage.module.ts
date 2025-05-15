import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { RedisConfigType } from '@modules/redis/config/redis-config.type';
import { AppConfig } from '@config/app.config.type';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const appConfig = config.get<AppConfig>('app');
        const redisConfig = config.get<RedisConfigType>('redis');
        return {
          throttlers: [
            {
              ttl: appConfig.throttleTTL,
              limit: appConfig.throttleLimit,
            },
          ],
          storage: new ThrottlerStorageRedisService({
            host: redisConfig.host,
            port: redisConfig.port,
            keyPrefix: 'rate-limit',
          }),
        };
      },
    }),
  ],
})
export class ThrottleStorageModule {}
