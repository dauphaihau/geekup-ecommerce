import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartService } from '@modules/api/cart/services/cart.service';
import { Transactional } from '@nestjs-cls/transactional';
import {
  OrderRepository,
  Order,
} from './repositories/order.repository';
import {
  PaymentMethodRepository,
  PaymentTransactionRepository,
} from '@modules/api/payment/repositories/payment.repository';
import { STRIPE_CLIENT } from '@modules/payment-gateways/stripe/stripe.module';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateOrderSingleProductDto } from './dto/create-order-single-product.dto';
import { ProductVariantRepository } from '@modules/api/product/repositories/product-variant.repository';
import { VoucherService } from '@modules/api/voucher/voucher.service';
import { AddressService } from '@modules/api/address/address.service';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';
import { MailService } from '@modules/mail/mail.service';
import { InventoryRepository } from '@modules/api/product/repositories/inventory.repository';
import { OrderVoucherRepository } from '@modules/api/order/repositories/order-voucher.repository';
import { OrderItem, OrderItemRepository } from '@modules/api/order/repositories/order-item.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly orderRepo: OrderRepository,
    private readonly productVariantRepo: ProductVariantRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly orderVoucherRepo: OrderVoucherRepository,
    private readonly configService: ConfigService,
    private readonly paymentMethodRepo: PaymentMethodRepository,
    private readonly paymentTransactionRepo: PaymentTransactionRepository,
    private readonly voucherService: VoucherService,
    private readonly mailService: MailService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Transactional()
  async createWithSingleProduct(
    dto: CreateOrderSingleProductDto,
    user: FullUserResponseDto,
  ) {
    await this.addressService.findOne(dto.shipping_address_id);

    const payment = await this.paymentMethodRepo.findById(
      dto.payment_method_id,
    );
    if (!payment) {
      throw new NotFoundException(
        `Payment method with ID "${payment.payment_method_id}" not found`,
      );
    }

    const productVariant = await this.productVariantRepo.findById(
      dto.variant_id,
    );
    if (!productVariant) {
      throw new NotFoundException(
        `Product variant with ID "${dto.variant_id}" not found`,
      );
    }

    const subtotal = productVariant.price * dto.quantity;

    // fake tax: 10%
    const tax = subtotal * 0.1;

    // fake shipping fee
    const shippingFee = 5;

    // let totalAmount = productVariant.price * dto.quantity;
    let totalAmount = subtotal + tax + shippingFee;
    const appliedVouchers = [];

    // Apply vouchers if provided
    if (dto.voucher_codes?.length) {
      let remainingAmount = totalAmount;

      // Process each voucher in sequence
      for (const code of dto.voucher_codes) {
        const voucher = await this.voucherService.validateVoucher(
          code,
          remainingAmount,
        );

        const newAmount = this.voucherService.calculateDiscountedAmount(
          voucher,
          remainingAmount,
        );

        const appliedDiscount = remainingAmount - newAmount;
        appliedVouchers.push({
          voucher,
          appliedDiscount,
        });

        remainingAmount = newAmount;
      }

      totalAmount = remainingAmount;
    }

    // Create order record
    const order = await this.orderRepo.create({
      user_id: user.user_id,
      shipping_address_id: dto.shipping_address_id,
      payment_method_id: dto.payment_method_id,
      subtotal,
      tax_amount: tax,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      order_status: 'pending',
    });

    // Create order item record
    await this.orderItemRepo.create({
      order_id: order.order_id,
      variant_id: productVariant.variant_id,
      quantity: dto.quantity,
      unit_price: productVariant.price,
      subtotal: dto.quantity * productVariant.price,
    });

    await this.inventoryRepo.updateWhere(
      `variant_id = '${productVariant.variant_id}'`,
      {
        stock_quantity: productVariant.stock_quantity - dto.quantity,
      },
    );

    // Create order voucher records
    for (const { voucher, appliedDiscount } of appliedVouchers) {
      await this.orderVoucherRepo.create({
        order_id: order.order_id,
        voucher_id: voucher.voucher_id,
        applied_discount: appliedDiscount,
      });
    }

    // Get the complete order with items
    const orderWithItems = await this.orderRepo.findOneWithItems(
      order.order_id,
    );

    // Create Stripe checkout session
    const stripeSession = await this.createCheckoutSession(orderWithItems);

    // Create payment transaction record
    await this.paymentTransactionRepo.create({
      order_id: order.order_id,
      payment_method_id: order.payment_method_id,
      amount: totalAmount,
      status: 'pending',
      transaction_reference: `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    console.log('order-with-items', orderWithItems);
    console.log('user-email', user.email);
    // Send order confirmation email
    await this.mailService.sendOrderConfirmation({
      to: user.email,
      data: {
        orderNumber: orderWithItems.order_id,
        orderDate: orderWithItems.created_at.toDateString(), // Format date as needed
        items: orderWithItems.items.map((item) => ({
          name: productVariant.sku, // Using product variant SKU as item name
          quantity: item.quantity,
          price: item.unit_price.toFixed(2), // Format price as string with 2 decimal places
        })),
        totalAmount: orderWithItems.total_amount.toFixed(2), // Format total amount as string
      },
    });

    return {
      ...order,
      checkout_url: stripeSession.url,
    };
  }

  // @Transactional()
  // async create(createOrderDto: CreateOrderDto, userId: string) {
  //   // Get the user's cart
  //   const cart = await this.cartService.getOrCreateCart(userId);
  //   const cartItems = await this.cartService.getCartItems(cart.cart_id);
  //
  //   if (!cartItems.length) {
  //     throw new NotFoundException('Cart is empty');
  //   }
  //
  //   // Calculate total amount
  //   const totalAmount = cartItems.reduce(
  //     (sum, item) => sum + item.quantity * item.unit_price,
  //     0
  //   );
  //
  //   // Create order record
  //   const order = await this.orderRepo.create({
  //     user_id: userId,
  //     shipping_address_id: createOrderDto.shipping_address_id,
  //     payment_method_id: createOrderDto.payment_method_id,
  //     total_amount: totalAmount,
  //     order_status: 'pending',
  //   });
  //
  //   // Create order items
  //   const orderItems = await this.orderItemRepo.createMany(
  //     cartItems.map(item => ({
  //       order_id: order.order_id,
  //       variant_id: item.variant_id,
  //       quantity: item.quantity,
  //       unit_price: item.unit_price,
  //       subtotal: item.quantity * item.unit_price,
  //     }))
  //   );
  //
  //   // Get the complete order with items
  //   const orderWithItems = await this.orderRepo.findOneWithItems(
  //     order.order_id,
  //   );
  //
  //   // Create Stripe checkout session
  //   const stripeSession = await this.createCheckoutSession(orderWithItems);
  //
  //   // Create payment transaction record
  //   await this.paymentTransactionRepo.create({
  //     order_id: order.order_id,
  //     payment_method_id: order.payment_method_id,
  //     amount: totalAmount,
  //     status: 'pending',
  //     transaction_reference: `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  //     session_id: stripeSession.id,
  //     session_url: stripeSession.url,
  //   });
  //
  //   // Clear the cart after successful order creation
  //   await this.cartService.clearCart(cart.cart_id);
  //
  //   return {
  //     ...order,
  //     // items: orderItems,
  //     checkout_url: stripeSession.url,
  //   };
  // }

  async findOne(orderId: string, userId: string) {
    const order = await this.orderRepo.findOneWithItems(orderId);
    if (!order || order.user_id !== userId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByUserId(userId: string) {
    return this.orderRepo.findByUserId(userId);
  }

  private async createCheckoutSession(
    order: Order & { items: OrderItem[] },
  ): Promise<{ id: string; url: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_DOMAIN')}/orders/${order.order_id}/success`,
      cancel_url: `${this.configService.get('FRONTEND_DOMAIN')}/orders/${order.order_id}/cancel`,
      metadata: {
        order_id: order.order_id,
      },
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Product ${item.variant_id}`,
          },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })),
    });

    return {
      id: session.id,
      url: session.url,
    };
  }
}
