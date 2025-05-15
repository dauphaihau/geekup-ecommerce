import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import {
  CartRepository,
  CartItemRepository,
} from './repositories/cart.repository';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartItemRepository],
  exports: [CartService],
})
export class CartModule {}
