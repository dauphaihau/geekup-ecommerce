-- migrate:up

-- Insert some default roles
INSERT INTO roles (name, description)
VALUES ('admin', 'System administrator with full access'),
       ('moderator', 'Moderator with additional permissions'),
       ('customer', 'Regular user with limited access');

INSERT INTO users (
  username,
  first_name,
  last_name
) VALUES (
           'admin_user',
           'Admin',
           'User'
         );

-- Insert authentication for admin user
INSERT INTO authenticates (user_id, email, password_hash)
SELECT user_id, 'admin@example.com', '$2b$10$OND0mB4WHjW3aN4ou/XJgu2CPEI6FL.OOwELPxWCBHnbPJzGpuJHy' -- example hash for 'Admin123.'
FROM users
WHERE username = 'admin_user';

-- Insert regular user
INSERT INTO users (
  username,
  first_name,
  last_name
) VALUES (
           'regular_user',
           'Regular',
           'User'
         );

-- Insert authentication for regular user
INSERT INTO authenticates (user_id, email, password_hash)
SELECT user_id, 'user@example.com', '$2b$10$MK5pbpd8nHhaGX2q5iEg6ODDOyrvvrJ1M/wEPeDqKxJPegS1V9I4i'-- example hash for 'user123'
FROM users
WHERE username = 'regular_user';

-- Associate users with roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.username = 'admin_user' AND r.name = 'admin';

INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.username = 'regular_user' AND r.name = 'customer';



INSERT INTO categories (category_name)
VALUES ('Electronics'),
       ('Clothing'),
       ('Home Decor'),
       ('Books'),
       ('Toys');

INSERT INTO stores (store_name)
VALUES ('Dev Store');

INSERT INTO stores (store_name)
VALUES ('Hai Store');


INSERT INTO payment_methods (method_name)
VALUES ('Stripe');

INSERT INTO products (category_id, product_name, description)
SELECT category_id,
       'Hello World Tee',
       'A simple tee with the phrase "Hello World" written on it.'
FROM categories c
WHERE c.category_name = 'Clothing';

INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id,
       'BL123456',
       10.50,
       'XL',
       'Black',
       10
FROM products p
WHERE p.product_name = 'Hello World Tee';

INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id,
       pv.variant_id,
       10
FROM product_variants pv
       JOIN stores s ON s.store_name = 'Dev Store'
WHERE pv.sku = 'BL123456';

INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id,
       'WL123456',
       20,
       'XL',
       'White',
       10
FROM products p
WHERE p.product_name = 'Hello World Tee';


INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id,
       pv.variant_id,
       10
FROM product_variants pv
       JOIN stores s ON s.store_name = 'Dev Store'
WHERE pv.sku = 'WL123456';

-- Electronics (10 products)
INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Smartphone X', 'Latest model with 128GB storage and 5G.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'SPX123', 699.99, 'Black', 20 FROM products p WHERE p.product_name = 'Smartphone X';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 20 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'SPX123';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Wireless Earbuds', 'Noise-cancelling earbuds with 24hr battery.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'WEB456', 129.99, 'White', 30 FROM products p WHERE p.product_name = 'Wireless Earbuds';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 30 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'WEB456';

-- Add 8 more Electronics products similarly
INSERT INTO products (category_id, product_name, description)
SELECT category_id, '4K TV 55"', 'Ultra HD smart TV with HDR.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'TV55123', 499.99, 'Black', 15 FROM products p WHERE p.product_name = '4K TV 55"';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 15 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'TV55123';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Gaming Laptop', 'High-performance laptop with RTX graphics.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'GLP789', 1299.99, 'Silver', 10 FROM products p WHERE p.product_name = 'Gaming Laptop';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 10 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'GLP789';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Smart Watch', 'Fitness tracker with heart rate monitor.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'SWT321', 199.99, 'Black', 25 FROM products p WHERE p.product_name = 'Smart Watch';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 25 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'SWT321';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Bluetooth Speaker', 'Portable speaker with deep bass.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'BSP654', 79.99, 'Blue', 40 FROM products p WHERE p.product_name = 'Bluetooth Speaker';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 40 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'BSP654';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Tablet 10"', 'Lightweight tablet with 64GB storage.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'TAB987', 299.99, 'Gray', 20 FROM products p WHERE p.product_name = 'Tablet 10"';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 20 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'TAB987';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Wireless Mouse', 'Ergonomic mouse with USB receiver.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'WMS111', 29.99, 'Black', 50 FROM products p WHERE p.product_name = 'Wireless Mouse';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 50 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'WMS111';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'USB-C Hub', 'Multi-port adapter for laptops.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'USB222', 39.99, 'Silver', 30 FROM products p WHERE p.product_name = 'USB-C Hub';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 30 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'USB222';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'External Hard Drive', '1TB portable storage drive.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'EHD333', 89.99, 'Black', 25 FROM products p WHERE p.product_name = 'External Hard Drive';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 25 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'EHD333';

-- Clothing (15 products, example with 2 variants for some)
INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Graphic Hoodie', 'Cozy hoodie with unique graphic print.' FROM categories WHERE category_name = 'Clothing';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'GHD444', 39.99, 'M', 'Gray', 20 FROM products p WHERE p.product_name = 'Graphic Hoodie';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 20 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'GHD444';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'GHD445', 39.99, 'L', 'Black', 20 FROM products p WHERE p.product_name = 'Graphic Hoodie';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 20 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'GHD445';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Denim Jacket', 'Classic blue denim jacket.' FROM categories WHERE category_name = 'Clothing';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'DNJ555', 59.99, 'S', 'Blue', 15 FROM products p WHERE p.product_name = 'Denim Jacket';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 15 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'DNJ555';

-- Add 13 more Clothing products (abridged for brevity, following same pattern)
INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Cotton T-Shirt', 'Soft cotton tee for everyday wear.' FROM categories WHERE category_name = 'Clothing';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'CTS666', 19.99, 'L', 'White', 30 FROM products p WHERE p.product_name = 'Cotton T-Shirt';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 30 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'CTS666';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Chino Pants', 'Slim-fit chinos for casual style.' FROM categories WHERE category_name = 'Clothing';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'CHP777', 49.99, 'M', 'Navy', 20 FROM products p WHERE p.product_name = 'Chino Pants';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 20 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'CHP777';

-- Continue for 11 more Clothing products like 'Sweatpants', 'Polo Shirt', 'Winter Coat', etc.

-- Home Decor (10 products)
INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Ceramic Vase', 'Handcrafted vase for flowers or decor.' FROM categories WHERE category_name = 'Home Decor';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'CVS888', 29.99, 'White', 15 FROM products p WHERE p.product_name = 'Ceramic Vase';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 15 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'CVS888';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Wall Art Print', 'Abstract art print in wooden frame.' FROM categories WHERE category_name = 'Home Decor';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'WAP999', 49.99, 'Multicolor', 10 FROM products p WHERE p.product_name = 'Wall Art Print';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 10 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'WAP999';

-- Add 8 more Home Decor products like 'Throw Blanket', 'Table Lamp', 'Cushion Set', etc.

-- Books (10 products)
INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Sci-Fi Novel', 'A thrilling space adventure novel.' FROM categories WHERE category_name = 'Books';
INSERT INTO product_variants (product_id, sku, price, stock_quantity)
SELECT p.product_id, 'SFN101', 14.99, 50 FROM products p WHERE p.product_name = 'Sci-Fi Novel';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 50 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'SFN101';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Cookbook', '100 recipes for home cooking.' FROM categories WHERE category_name = 'Books';
INSERT INTO product_variants (product_id, sku, price, stock_quantity)
SELECT p.product_id, 'CKB202', 24.99, 30 FROM products p WHERE p.product_name = 'Cookbook';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 30 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'CKB202';

-- Toys (5 products)
INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Building Blocks', 'Colorful blocks for creative play.' FROM categories WHERE category_name = 'Toys';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'BLK303', 19.99, 'Multicolor', 40 FROM products p WHERE p.product_name = 'Building Blocks';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 40 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'BLK303';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Action Figure', 'Poseable superhero figure.' FROM categories WHERE category_name = 'Toys';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'ACF404', 14.99, 'Red', 25 FROM products p WHERE p.product_name = 'Action Figure';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 25 FROM product_variants pv JOIN stores s ON s.store_name = 'Dev Store' WHERE pv.sku = 'ACF404';

-- Add 10 products for Hai Store

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Vintage Camera', 'Classic film camera, great for photography enthusiasts.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'VCM111', 199.99, 'Silver', 10 FROM products p WHERE p.product_name = 'Vintage Camera';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 10 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'VCM111';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Novelty Socks', 'Funky socks with unique patterns.' FROM categories WHERE category_name = 'Clothing';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'NSK222', 9.99, 'One Size', 'Multicolor', 50 FROM products p WHERE p.product_name = 'Novelty Socks';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 50 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'NSK222';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Mystery Thriller', 'A gripping book with unexpected twists.' FROM categories WHERE category_name = 'Books';
INSERT INTO product_variants (product_id, sku, price, stock_quantity)
SELECT p.product_id, 'MTB333', 12.50, 30 FROM products p WHERE p.product_name = 'Mystery Thriller';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 30 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'MTB333';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Desk Organizer', 'Keeps your workspace tidy and efficient.' FROM categories WHERE category_name = 'Home Decor';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'DOR444', 25.00, 'Black', 20 FROM products p WHERE p.product_name = 'Desk Organizer';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 20 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'DOR444';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Plush Toy', 'Soft and cuddly animal plush.' FROM categories WHERE category_name = 'Toys';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'PTY555', 15.00, 'Brown', 40 FROM products p WHERE p.product_name = 'Plush Toy';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 40 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'PTY555';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'E-reader', 'Portable device for reading digital books.' FROM categories WHERE category_name = 'Electronics';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'ERD666', 109.99, 'White', 15 FROM products p WHERE p.product_name = 'E-reader';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 15 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'ERD666';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Graphic T-Shirt', 'Comfortable tee with a cool design.' FROM categories WHERE category_name = 'Clothing';
INSERT INTO product_variants (product_id, sku, price, size, color, stock_quantity)
SELECT p.product_id, 'GTS777', 22.00, 'L', 'Gray', 35 FROM products p WHERE p.product_name = 'Graphic T-Shirt';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 35 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'GTS777';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Self-Help Book', 'Guide to personal development.' FROM categories WHERE category_name = 'Books';
INSERT INTO product_variants (product_id, sku, price, stock_quantity)
SELECT p.product_id, 'SHB888', 18.00, 25 FROM products p WHERE p.product_name = 'Self-Help Book';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 25 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'SHB888';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Scented Candle', 'Relaxing candle with a pleasant fragrance.' FROM categories WHERE category_name = 'Home Decor';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'SCD999', 16.00, 'Vanilla', 30 FROM products p WHERE p.product_name = 'Scented Candle';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 30 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'SCD999';

INSERT INTO products (category_id, product_name, description)
SELECT category_id, 'Toy Car Set', 'Set of miniature cars for play.' FROM categories WHERE category_name = 'Toys';
INSERT INTO product_variants (product_id, sku, price, color, stock_quantity)
SELECT p.product_id, 'TCS000', 11.00, 'Multicolor', 45 FROM products p WHERE p.product_name = 'Toy Car Set';
INSERT INTO inventories (store_id, variant_id, stock_quantity)
SELECT s.store_id, pv.variant_id, 45 FROM product_variants pv JOIN stores s ON s.store_name = 'Hai Store' WHERE pv.sku = 'TCS000';


-- Vouchers

INSERT INTO vouchers (code, description, discount_type, discount_value, min_order_amount, usage_limit, expiry_date, is_active)
VALUES ('10OFF', '10% off your next purchase', 'percentage', 10.0, 50.0, 3, '2029-06-30 00:00:00', true);

INSERT INTO vouchers (code, description, discount_type, discount_value, min_order_amount, usage_limit, expiry_date, is_active)
VALUES ('FREE', 'Free shipping on orders over $100', 'fixed_amount', 0.0, 100.0, 5, '2023-07-15 00:00:00', true);



-- migrate:down
