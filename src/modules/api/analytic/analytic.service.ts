import { Injectable } from '@nestjs/common';
import { OrderRepository } from '@modules/api/order/repositories/order.repository';
import { GetChurnRateCustomersDto } from '@modules/api/analytic/dto/get-churn-rate-customers.dto';
import { GetAverageOrderValueDto } from '@modules/api/analytic/dto/get-avarage-order-value.dto';

@Injectable()
export class AnalyticService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async getChurnRateCustomers(query: GetChurnRateCustomersDto) {
    const today = new Date();
    const windowMonths = query.window_months || 6; // Default window duration to 6 months

    let recentWindowEnd = today;
    if (query.to_date) {
      // Parse the provided to_date
      const [year, month, day] = query.to_date.split('-').map(Number);
      // Month is 0-indexed in Date constructor
      recentWindowEnd = new Date(year, month - 1, day);
    }

    // Calculate recent window start date (windowMonths before end)
    const recentWindowStart = new Date(recentWindowEnd);
    recentWindowStart.setMonth(recentWindowStart.getMonth() - windowMonths);

    // Calculate past window end date (same as recent window start date)
    const pastWindowEnd = new Date(recentWindowStart);

    // Calculate past window start date (windowMonths before past window end)
    const pastWindowStart = new Date(pastWindowEnd);
    pastWindowStart.setMonth(pastWindowStart.getMonth() - windowMonths);

    const pastCustomers = await this.orderRepo.findDistinctUserIdsBetween(
      pastWindowStart, // Use calculated past window start
      pastWindowEnd, // Use calculated past window end
    );
    const recentCustomers = await this.orderRepo.findDistinctUserIdsBetween(
      recentWindowStart, // Use calculated recent window start
      recentWindowEnd, // Use calculated recent window end
    );

    const churned = pastCustomers.filter((id) => !recentCustomers.includes(id));
    // Avoid division by zero if no past customers
    const churnRate =
      pastCustomers.length > 0
        ? (churned.length / pastCustomers.length) * 100
        : 0;

    return {
      from: pastWindowStart.toISOString().split('T')[0], // Return calculated dates in response
      to: recentWindowEnd.toISOString().split('T')[0],
      window_months: windowMonths,
      total_past_customers: pastCustomers.length,
      churned_customers: churned.length,
      churn_rate: parseFloat(churnRate.toFixed(2)),
    };
  }

  async getAverageOrderValue(query: GetAverageOrderValueDto) {
    const year = query.year || new Date().getFullYear().toString();
    return await this.orderRepo.getAverageOrderValue(year);
  }
}
