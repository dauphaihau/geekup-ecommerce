import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@modules/app.module';
import { DATABASE_CONNECTION } from '@modules/database/database.provider';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.enableShutdownHooks();
  await app.init();
}, 30000);

afterAll(async () => {
  if (app) {
    const db = app.get(DATABASE_CONNECTION);
    if (db && db.$pool) {
      await Promise.race([
        db.$pool.end(),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    }
    await Promise.race([
      app.close(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  }
}, 30000);

export { app };
