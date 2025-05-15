import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CurrentUser } from '@app/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '@app/guards/optional-jwt-auth.guard';

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  async addItem(
    @Body() createCartItemDto: CreateCartItemDto,
    @CurrentUser('user_id') userId: string,
    @Headers('session-id') sessionId: string,
  ) {
    const cart = await this.cartService.getOrCreateCart(userId, sessionId);
    return this.cartService.addItemToCart(cart.cart_id, createCartItemDto);
  }

  @Get('items')
  async getItems(
    @CurrentUser('user_id') userId: string,
    @Headers('session-id') sessionId: string,
  ) {
    const cart = await this.cartService.getOrCreateCart(userId, sessionId);
    return this.cartService.getCartItems(cart.cart_id);
  }

  @Patch('items/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(id, updateCartItemDto);
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string) {
    return this.cartService.removeCartItem(id);
  }

  // @Delete('clear')
  // async clearCart(
  //   @CurrentUser('user_id') userId: string,
  //   @Headers('session-id') sessionId: string,
  // ) {
  //   const cart = await this.cartService.getOrCreateCart(userId, sessionId);
  //   return this.cartService.clearCart(cart.cart_id);
  // }
} 