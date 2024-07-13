CREATE DATABASE orders;

\c orders

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    number_of_items INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL
);
