-- migrate:up

-- Table for Shopping Carts
CREATE TABLE shopping_carts (
  cart_id    UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users (user_id), -- Can be NULL for guest users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Potentially add a session_id for guest users to track their cart
  session_id VARCHAR(255)
);

-- Table for Items in the Shopping Cart
CREATE TABLE cart_items (
  cart_item_id UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  cart_id      UUID REFERENCES shopping_carts (cart_id)      NOT NULL,
  variant_id   UUID REFERENCES product_variants (variant_id) NOT NULL,
  quantity     INTEGER                                       NOT NULL CHECK (quantity > 0),
  added_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

