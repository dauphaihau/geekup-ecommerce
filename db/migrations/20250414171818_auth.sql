-- migrate:up

CREATE TABLE authenticates (
  auth_id       UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL,
  email         VARCHAR(255) UNIQUE,
  phone_number  VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  last_login    TIMESTAMP,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
  token_id   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  user_id    UUID                     NOT NULL,
  token_hash VARCHAR(255) UNIQUE      NOT NULL,
  revoked    BOOLEAN                  DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE password_reset_tokens (
  token_id   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  user_id    UUID                NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  revoked    BOOLEAN                  DEFAULT FALSE,
  expires_at TIMESTAMPTZ         NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


-- migrate:down

