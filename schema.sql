CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist to avoid duplicates
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS pdf_summaries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(255),
    customer_id VARCHAR(255) UNIQUE,
    price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'inactive'
);

-- PDF_SUMMARIES table
CREATE TABLE pdf_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    original_file_url TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    title TEXT,
    file_name TEXT,
    file_key TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENTS table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Auto-updated updated_at field trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_summaries_updated_at
    BEFORE UPDATE ON pdf_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
