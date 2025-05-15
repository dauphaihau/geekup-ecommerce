-- migrate:up

-- Table for Orders
CREATE TABLE orders (
  order_id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users (user_id),
  payment_method_id   UUID REFERENCES payment_methods (payment_method_id),
  shipping_address_id UUID REFERENCES addresses (address_id),
  order_status        VARCHAR(50),             -- e.g., "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
  subtotal            DECIMAL(10, 2) NOT NULL, -- before tax/fees
  tax_amount          DECIMAL(10, 2) NOT NULL  DEFAULT 0.00,
  shipping_fee        DECIMAL(10, 2) NOT NULL  DEFAULT 0.00,
  total_amount        DECIMAL(10, 2) NOT NULL, -- subtotal + tax + shipping - discounts
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Order Items (linking orders and products)
CREATE TABLE order_items (
  order_item_id UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  order_id      UUID REFERENCES orders (order_id) ON DELETE CASCADE,
  variant_id    UUID REFERENCES product_variants (variant_id),
  quantity      INTEGER        NOT NULL,
  unit_price    DECIMAL(10, 2) NOT NULL,
  subtotal      DECIMAL(10, 2) NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

