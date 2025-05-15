import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { databaseProvider } from '@modules/database/database.provider';

@Global()
@Module({
  providers: [DatabaseService, databaseProvider],
  exports: [DatabaseService, databaseProvider],
})
export class DatabaseModule {}
