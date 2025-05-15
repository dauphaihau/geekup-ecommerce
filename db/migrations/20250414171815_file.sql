-- migrate:up

CREATE TABLE files (
  file_id     UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  path        VARCHAR(512) NOT NULL,
  mime_type   VARCHAR(128),
  size        BIGINT,
  uploaded_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users (user_id) ON DELETE SET NULL
);

-- migrate:down

