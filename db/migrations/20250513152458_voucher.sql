-- migrate:up
CREATE TABLE vouchers (
  voucher_id       UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  code             VARCHAR(50) UNIQUE NOT NULL,                  -- The unique code users will enter
  description      TEXT,
  discount_type    VARCHAR(50)        NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value   DECIMAL(10, 2)     NOT NULL CHECK (discount_value >= 0),
  min_order_amount DECIMAL(10, 2) CHECK (min_order_amount >= 0), -- Optional minimum order value
  usage_limit      INTEGER CHECK (usage_limit >= 0),             -- Maximum number of times the voucher can be used
  expiry_date      TIMESTAMP WITH TIME ZONE,
  is_active        BOOLEAN                  DEFAULT TRUE,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vouchers_code ON vouchers (code);

-- migrate:down

