import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';
import { OrderVoucher } from '@modules/api/order/repositories/order-voucher.repository';
import { OrderItem } from '@modules/api/order/repositories/order-item.repository';

export interface Order {
  order_id: string;
  user_id: string;
  payment_method_id: string;
  shipping_address_id: string;
  order_status: string;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  protected tableName = 'orders';
  protected primaryKey = 'order_id';
  protected logger = new Logger(OrderRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findOneWithItems(
    orderId: string,
  ): Promise<Order & { items: OrderItem[]; vouchers: OrderVoucher[] }> {
    const result = await this.dbService.executeQuerySingle<
      Order & { items: OrderItem[]; vouchers: OrderVoucher[] }
    >(
      'orders.findOneWithItems',
      `
      SELECT 
        o.*,
        o.total_amount::INT,
        COALESCE(
          json_agg(
            json_build_object(
              'order_item_id', oi.order_item_id,
              'order_id', oi.order_id,
              'variant_id', oi.variant_id,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'subtotal', oi.subtotal,
              'created_at', oi.created_at,
              'updated_at', oi.updated_at
            )
          ) FILTER (WHERE oi.order_item_id IS NOT NULL),
          '[]'
        ) as items,
        COALESCE(
          json_agg(
            json_build_object(
              'order_voucher_id', ov.order_voucher_id,
              'order_id', ov.order_id,
              'voucher_id', ov.voucher_id,
              'applied_discount', ov.applied_discount,
              'created_at', ov.created_at,
              'updated_at', ov.updated_at
            )
          ) FILTER (WHERE ov.order_voucher_id IS NOT NULL),
          '[]'
        ) as vouchers
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN order_vouchers ov ON o.order_id = ov.order_id
      WHERE o.order_id = $1
      GROUP BY o.order_id
      `,
      [orderId],
    );

    return result;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.findWhere('user_id = $1', [userId]);
  }

  async findDistinctUserIdsBetween(
    startDate: Date,
    endDate: Date,
  ): Promise<string[]> {
    const sql = `
        SELECT DISTINCT user_id
        FROM orders o
        WHERE o.created_at BETWEEN $1 AND $2;
    `;
    const result = await this.dbService.executeQuery<{ user_id: string }>(
      `findDistinctUserIdsBetween`,
      sql,
      [startDate.toISOString(), endDate.toISOString()],
    );
    return result.map((row) => row.user_id);
  }

  async getAverageOrderValue(year: string) {
    const sql = `
        SELECT TO_CHAR(o.created_at, 'YYYY-MM') AS order_month,
               ROUND(AVG(total_amount), 2)      AS average_order_value
        FROM orders o
        WHERE EXTRACT(YEAR FROM o.created_at) = $1
        GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
        ORDER BY order_month;
    `;
    return await this.dbService.executeQuery(`getAverageOrderValue`, sql, [
      year,
    ]);
  }
}
