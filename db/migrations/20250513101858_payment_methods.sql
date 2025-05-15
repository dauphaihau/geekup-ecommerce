-- migrate:up

CREATE TABLE payment_methods (
  payment_method_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name       VARCHAR(50) UNIQUE NOT NULL
);
-- migrate:down

