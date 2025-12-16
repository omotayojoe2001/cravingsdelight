-- Add payment method fields to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'bank_transfer';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_link TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT '{}';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paypal_email VARCHAR(255);

-- Create payment_settings table for admin configuration
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  method_type VARCHAR(50) NOT NULL, -- 'bank_transfer', 'paypal', 'stripe'
  is_active BOOLEAN DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment methods
INSERT INTO payment_settings (method_type, settings) VALUES 
('bank_transfer', '{"account_name": "Cravings Delight Ltd", "account_number": "", "sort_code": "", "bank_name": "", "iban": "", "swift": ""}'),
('paypal', '{"email": "", "business_name": "Cravings Delight"}'),
('stripe', '{"publishable_key": "", "webhook_endpoint": ""}')