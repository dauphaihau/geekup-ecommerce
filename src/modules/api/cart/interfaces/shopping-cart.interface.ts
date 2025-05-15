export interface ShoppingCart {
  cart_id: string;
  user_id?: string;
  session_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  cart_item_id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  added_at: Date;
} 