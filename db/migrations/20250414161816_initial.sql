-- migrate:up

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  user_id    UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  first_name VARCHAR(50),
  last_name  VARCHAR(50),
  username   VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS
$$
BEGIN
  new.updated_at = CURRENT_TIMESTAMP;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- migrate:down