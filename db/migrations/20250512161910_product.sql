-- migrate:up

-- Table for Product Categories
CREATE TABLE categories (
  category_id   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  category_name VARCHAR(100) UNIQUE NOT NULL,
  description   TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Base Products (representing the general product)
CREATE TABLE products (
  product_id   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES categories (category_id),
  product_name VARCHAR(255) NOT NULL,
  description  TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Product Variants (specific variations of a base product)
CREATE TABLE product_variants (
  variant_id     UUID PRIMARY KEY                                        DEFAULT gen_random_uuid(),
  product_id     UUID REFERENCES products (product_id),
  sku            VARCHAR(50) UNIQUE NOT NULL,
  price          DECIMAL(10, 2)     NOT NULL,
  size           VARCHAR(50),
  color          VARCHAR(50),
  -- Add other variant attributes as needed (e.g., material, style)
  image_url      VARCHAR(255),
  stock_quantity INTEGER            NOT NULL CHECK (stock_quantity >= 0) DEFAULT 0,
  created_at     TIMESTAMP WITH TIME ZONE                                DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP WITH TIME ZONE                                DEFAULT CURRENT_TIMESTAMP
);

-- Table for Inventories (linking stores and products)
CREATE TABLE inventories (
  inventory_id      UUID PRIMARY KEY                             DEFAULT gen_random_uuid(),
  store_id          UUID REFERENCES stores (store_id),
  variant_id        UUID REFERENCES product_variants (variant_id),
  stock_quantity    INTEGER NOT NULL CHECK (stock_quantity >= 0) DEFAULT 0,
  last_stock_update TIMESTAMP WITH TIME ZONE                     DEFAULT CURRENT_TIMESTAMP,
  created_at        TIMESTAMP WITH TIME ZONE                     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP WITH TIME ZONE                     DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

