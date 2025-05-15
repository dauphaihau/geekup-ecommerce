-- migrate:up

CREATE TABLE payment_transactions (
  transaction_id        UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  order_id              UUID REFERENCES orders (order_id)                   NOT NULL,
  payment_method_id     UUID REFERENCES payment_methods (payment_method_id) NOT NULL,
  transaction_date      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  amount                DECIMAL(10, 2)                                      NOT NULL,
  status                VARCHAR(50)                                         NOT NULL, -- e.g., 'pending', 'successful', 'failed', 'refunded'
  transaction_reference VARCHAR(255) UNIQUE,                                          -- Identifier from the payment gateway
  failure_reason        TEXT
);

-- migrate:down

