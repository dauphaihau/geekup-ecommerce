import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CartRepository,
  CartItemRepository,
} from '../repositories/cart.repository';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ShoppingCart, CartItem } from '../interfaces/shopping-cart.interface';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  async getOrCreateCart(
    userId?: string,
    sessionId?: string,
  ): Promise<ShoppingCart> {
    let cart: ShoppingCart | null = null;

    if (userId) {
      cart = await this.cartRepository.findByUserId(userId);
    } else if (sessionId) {
      cart = await this.cartRepository.findBySessionId(sessionId);
    }

    if (!cart) {
      cart = await this.cartRepository.create({
        user_id: userId,
        session_id: sessionId,
      });
    }

    return cart;
  }

  async addItemToCart(
    cartId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    const existingItem = await this.cartItemRepository.findCartItemByVariant(
      cartId,
      createCartItemDto.variant_id,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + createCartItemDto.quantity;
      return this.cartItemRepository.updateQuantity(
        existingItem.cart_item_id,
        newQuantity,
      );
    }

    return this.cartItemRepository.create({
      cart_id: cartId,
      ...createCartItemDto,
    });
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    return this.cartItemRepository.findByCartId(cartId);
  }

  async updateCartItem(
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const updated = await this.cartItemRepository.update(
      cartItemId,
      updateCartItemDto,
    );
    if (!updated) {
      throw new NotFoundException(
        `Cart item with ID "${cartItemId}" not found`,
      );
    }
    return updated;
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    const result = await this.cartItemRepository.delete(cartItemId);
    if (result === 0) {
      throw new NotFoundException(
        `Cart item with ID "${cartItemId}" not found`,
      );
    }
  }

  // async clearCart(cartId: string): Promise<void> {
  //   await this.cartItemRepository.updateWhere('cart_id = $1', [cartId]);
  // }
}
