-- Receipt Scanner Database Schema
-- This schema supports storing processed receipt data for history and analytics

-- Create database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS receipt_scanner;
-- USE receipt_scanner;

-- Table for storing receipt information
CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Basic receipt info
    merchant VARCHAR(255) NOT NULL,
    date_of_purchase DATE,
    total_amount DECIMAL(10, 2) NOT NULL,
    subtotal_amount DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2),
    
    -- File and processing info
    original_filename VARCHAR(255),
    file_hash VARCHAR(64) UNIQUE, -- To prevent duplicate processing
    processing_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
    
    -- OCR and AI processing data
    ocr_text TEXT,
    parsed_json TEXT, -- Store the full parsed JSON response
    confidence_score DECIMAL(3, 2), -- AI confidence in parsing (0.00-1.00)
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- User tracking (for future multi-user support)
    user_id VARCHAR(50) DEFAULT 'default_user',
    
    -- Additional fields for search and categorization
    category VARCHAR(100), -- grocery, restaurant, gas, etc.
    tags TEXT, -- comma-separated tags
    notes TEXT -- user notes
);

-- Table for storing individual receipt items
CREATE TABLE IF NOT EXISTS receipt_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_id INTEGER NOT NULL,
    
    -- Item details
    item_name VARCHAR(255) NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2), -- price per unit if quantity > 1
    
    -- Item categorization
    category VARCHAR(100), -- food, beverage, household, etc.
    subcategory VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

-- Table for storing processing errors and logs
CREATE TABLE IF NOT EXISTS processing_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Processing details
    filename VARCHAR(255),
    file_hash VARCHAR(64),
    processing_step VARCHAR(50), -- ocr, parsing, validation
    status VARCHAR(20), -- success, error, warning
    
    -- Error details
    error_message TEXT,
    error_details TEXT, -- JSON with detailed error info
    
    -- Timing
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- User context
    user_id VARCHAR(50) DEFAULT 'default_user'
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date_of_purchase);
CREATE INDEX IF NOT EXISTS idx_receipts_merchant ON receipts(merchant);
CREATE INDEX IF NOT EXISTS idx_receipts_user ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_created ON receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipts_hash ON receipts(file_hash);

CREATE INDEX IF NOT EXISTS idx_items_receipt ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_items_name ON receipt_items(item_name);
CREATE INDEX IF NOT EXISTS idx_items_category ON receipt_items(category);

CREATE INDEX IF NOT EXISTS idx_logs_status ON processing_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_step ON processing_logs(processing_step);
CREATE INDEX IF NOT EXISTS idx_logs_created ON processing_logs(created_at);

-- Views for common queries
CREATE VIEW IF NOT EXISTS receipt_summary AS
SELECT 
    r.id,
    r.merchant,
    r.date_of_purchase,
    r.total_amount,
    r.created_at,
    COUNT(ri.id) as item_count,
    r.category,
    r.processing_status
FROM receipts r
LEFT JOIN receipt_items ri ON r.id = ri.receipt_id
GROUP BY r.id;

CREATE VIEW IF NOT EXISTS monthly_spending AS
SELECT 
    strftime('%Y-%m', date_of_purchase) as month,
    COUNT(*) as receipt_count,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as avg_receipt_amount,
    GROUP_CONCAT(DISTINCT merchant) as merchants
FROM receipts 
WHERE processing_status = 'completed'
GROUP BY strftime('%Y-%m', date_of_purchase)
ORDER BY month DESC;

-- Sample data for testing (uncomment if needed)
/*
INSERT INTO receipts (merchant, date_of_purchase, total_amount, subtotal_amount, tax_amount, category) 
VALUES ('Sample Store', '2024-01-15', 25.99, 24.00, 1.99, 'grocery');

INSERT INTO receipt_items (receipt_id, item_name, item_price, quantity) 
VALUES (1, 'Sample Item 1', 12.99, 1), (1, 'Sample Item 2', 11.01, 1);
*/
