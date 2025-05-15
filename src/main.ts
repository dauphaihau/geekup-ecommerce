import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app.module';
import {
  Logger,
  LogLevel,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { type AllConfigType } from '@config/config.type';
import { setupSwagger } from './utils/setup-swagger';
import { Environment } from '@app/constants/app.constant';
import bodyParser from 'body-parser';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === Environment.Production;

  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'verbose', 'debug'];

  // await runDbMigration();

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
    rawBody: true,
    bodyParser: true,
  });

  const configService = app.get(ConfigService<AllConfigType>);
  const port = configService.getOrThrow('app.port', { infer: true });
  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true });
  const apiVersion = configService.getOrThrow('app.apiVersion', {
    infer: true,
  });
  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use('/api/v1/payments/stripe/webhook', bodyParser.raw({ type: '*/*' }));

  app.enableShutdownHooks();
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Use global prefix if you don't have subdomain
  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      { method: RequestMethod.GET, path: '/' },
      { method: RequestMethod.GET, path: 'health' },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  if (!isProduction) {
    setupSwagger(app);
  }

  await app.listen(port);
  Logger.log(`Application running on port: ${port}`);
}

void bootstrap();
