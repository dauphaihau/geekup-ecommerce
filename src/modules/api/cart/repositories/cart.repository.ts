import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';
import { ShoppingCart, CartItem } from '../interfaces/shopping-cart.interface';

@Injectable()
export class CartRepository extends BaseRepository<ShoppingCart> {
  protected tableName = 'shopping_carts';
  protected primaryKey = 'cart_id';
  protected logger = new Logger(CartRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findByUserId(userId: string): Promise<ShoppingCart | null> {
    return this.findOne('user_id = $1', [userId]);
  }

  async findBySessionId(sessionId: string): Promise<ShoppingCart | null> {
    return this.findOne('session_id = $1', [sessionId]);
  }
}

@Injectable()
export class CartItemRepository extends BaseRepository<CartItem> {
  protected tableName = 'cart_items';
  protected primaryKey = 'cart_item_id';
  protected logger = new Logger(CartItemRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findByCartId(cartId: string): Promise<CartItem[]> {
    return this.findWhere('cart_id = $1', [cartId]);
  }

  async findCartItemByVariant(
    cartId: string,
    variantId: string,
  ): Promise<CartItem | null> {
    return this.findOne('cart_id = $1 AND variant_id = $2', [
      cartId,
      variantId,
    ]);
  }

  async updateQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem | null> {
    return this.update(cartItemId, { quantity });
  }
}
