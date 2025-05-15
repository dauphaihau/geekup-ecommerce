import { AppConfig } from './app.config.type';
import { AuthConfig } from '@modules/api/auth/config/auth-config.type';
import { MailConfig } from '@modules/mail/config/mail-config.type';
import { DatabaseConfig } from '@modules/database/config/database-config.type';
import { FileStorageConfig } from '@modules/api/file/config/file-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  file: FileStorageConfig;
  mail: MailConfig;
};
