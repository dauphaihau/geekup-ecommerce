-- migrate:up

-- Table for Stores
CREATE TABLE stores (
  store_id   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  store_name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- migrate:down

