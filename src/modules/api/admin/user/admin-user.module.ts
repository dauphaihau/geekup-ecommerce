import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { UserModule } from '@modules/api/user/user.module';
import { AuthModule } from '@modules/api/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  providers: [AdminUserService],
  controllers: [AdminUserController],
  exports: [],
})
export class AdminUserModule {}
