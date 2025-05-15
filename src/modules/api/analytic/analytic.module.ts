import { Module } from '@nestjs/common';
import { AnalyticController } from '@modules/api/analytic/analytic.controller';
import { OrderRepository } from '@modules/api/order/repositories/order.repository';
import { AnalyticService } from '@modules/api/analytic/analytic.service';

@Module({
  providers: [AnalyticService, OrderRepository],
  controllers: [AnalyticController],
  exports: [AnalyticService],
})
export class AnalyticModule {}
