-- DLRS Database Schema
-- Decentralized Land Registry System

CREATE DATABASE IF NOT EXISTS dlrs_db;
USE dlrs_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SELLER', 'BUYER', 'INSPECTOR', 'ADMIN') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_uid VARCHAR(50) UNIQUE NOT NULL,
    owner_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    area DOUBLE NOT NULL,
    gis_coordinates VARCHAR(100),
    status ENUM('REGISTERED', 'FOR_SALE', 'PENDING_TRANSFER', 'TRANSFERRED') NOT NULL DEFAULT 'REGISTERED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_checksum VARCHAR(64) NOT NULL,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('INITIATED', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'INITIATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Blocks table (Blockchain)
CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_index INT UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    transaction_id BIGINT NOT NULL UNIQUE,
    data_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    nonce BIGINT NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_property_uid ON properties(property_uid);
CREATE INDEX idx_property_owner ON properties(owner_id);
CREATE INDEX idx_property_status ON properties(status);
CREATE INDEX idx_transaction_buyer ON transactions(buyer_id);
CREATE INDEX idx_transaction_seller ON transactions(seller_id);
CREATE INDEX idx_transaction_status ON transactions(status);
CREATE INDEX idx_block_index ON blocks(block_index);
CREATE INDEX idx_block_transaction ON blocks(transaction_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- Seed data
-- Default password for all seeded users: password123 (BCrypt hash)
-- You can generate new hashes using: BCryptPasswordEncoder.encode("password123")

-- Admin user
INSERT INTO users (username, password_hash, role, full_name, email) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iw0m2Z6e', 'ADMIN', 'System Admin', 'admin@dlrs.com');

-- Inspector user
INSERT INTO users (username, password_hash, role, full_name, email) VALUES
('inspector', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iw0m2Z6e', 'INSPECTOR', 'John Inspector', 'inspector@dlrs.com');

-- Seller user
INSERT INTO users (username, password_hash, role, full_name, email) VALUES
('seller1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iw0m2Z6e', 'SELLER', 'Alice Seller', 'seller1@dlrs.com');

-- Buyer user
INSERT INTO users (username, password_hash, role, full_name, email) VALUES
('buyer1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iw0m2Z6e', 'BUYER', 'Bob Buyer', 'buyer1@dlrs.com');

-- Sample property (owned by seller1)
INSERT INTO properties (property_uid, owner_id, title, address, area, gis_coordinates, status) VALUES
('PROP-12345678', (SELECT id FROM users WHERE username = 'seller1'), 
 'Luxury Villa', '123 Main Street, City, State 12345', 2500.50, '28.6139,77.2090', 'FOR_SALE');

-- Note: The password hash above is for "password123"
-- In production, always use strong, unique passwords

