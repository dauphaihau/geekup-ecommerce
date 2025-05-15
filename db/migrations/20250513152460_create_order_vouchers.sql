-- migrate:up

-- Create order_vouchers table
CREATE TABLE order_vouchers (
  order_voucher_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(order_id),
  voucher_id UUID NOT NULL REFERENCES vouchers(voucher_id),
  applied_discount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(order_id, voucher_id)
);

CREATE INDEX idx_order_vouchers_order_id ON order_vouchers(order_id);
CREATE INDEX idx_order_vouchers_voucher_id ON order_vouchers(voucher_id);

-- migrate:down