-- migrate:up

-- Table for Addresses
CREATE TABLE addresses (
  address_id     UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users (user_id),
  street_address VARCHAR(255) NOT NULL,
  city           VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code    VARCHAR(20),
  country        VARCHAR(100) NOT NULL,
  is_default     BOOLEAN                  DEFAULT FALSE,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- migrate:down

