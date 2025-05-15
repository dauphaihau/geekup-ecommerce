import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticService } from '@modules/api/analytic/analytic.service';
import { GetChurnRateCustomersDto } from '@modules/api/analytic/dto/get-churn-rate-customers.dto';
import { GetAverageOrderValueDto } from '@modules/api/analytic/dto/get-avarage-order-value.dto';
import JwtAuthenticationGuard from '@app/guards/jwt-authentication.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { Roles } from '@app/decorators/roles.decorator';
import { Role } from '@app/constants/role.enum';

@Controller('analytics')
@Roles(Role.Admin)
@UseGuards(JwtAuthenticationGuard, RolesGuard)
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get('churn-rate')
  async getChurnRate(@Query() query: GetChurnRateCustomersDto) {
    return this.analyticService.getChurnRateCustomers(query);
  }

  @Get('average-order')
  async getAverageOrderValue(@Query() query: GetAverageOrderValueDto) {
    return this.analyticService.getAverageOrderValue(query);
  }
}
