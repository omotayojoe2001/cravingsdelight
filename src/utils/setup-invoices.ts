import { supabase } from '@/lib/supabase';

export async function setupInvoiceSystem() {
  try {
    console.log('Setting up invoice system...');
    
    // Drop existing function and trigger first
    await supabase.rpc('exec_sql', {
      sql: 'DROP TRIGGER IF EXISTS trigger_set_invoice_number ON invoices;'
    });
    
    await supabase.rpc('exec_sql', {
      sql: 'DROP FUNCTION IF EXISTS set_invoice_number();'
    });
    
    await supabase.rpc('exec_sql', {
      sql: 'DROP FUNCTION IF EXISTS generate_invoice_number();'
    });
    
    // Create invoices table
    const { error: invoicesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS invoices (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          catering_request_id UUID,
          invoice_number VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50),
          event_date DATE,
          event_time TIME,
          event_location TEXT,
          number_of_guests INTEGER,
          invoice_items JSONB NOT NULL DEFAULT '[]',
          subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
          tax_rate DECIMAL(5,2) DEFAULT 0,
          tax_amount DECIMAL(10,2) DEFAULT 0,
          delivery_fee DECIMAL(10,2) DEFAULT 0,
          discount_amount DECIMAL(10,2) DEFAULT 0,
          total_amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(50) DEFAULT 'bank_transfer',
          payment_link TEXT,
          bank_details JSONB DEFAULT '{}',
          paypal_email VARCHAR(255),
          notes TEXT,
          terms_conditions TEXT,
          due_date DATE,
          status VARCHAR(50) DEFAULT 'draft',
          sent_at TIMESTAMP WITH TIME ZONE,
          paid_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (invoicesError) {
      console.error('Error creating invoices table:', invoicesError);
      return false;
    }
    
    // Create payment_settings table
    const { error: paymentError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS payment_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          method_type VARCHAR(50) UNIQUE NOT NULL,
          is_active BOOLEAN DEFAULT true,
          settings JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (paymentError) {
      console.error('Error creating payment_settings table:', paymentError);
      return false;
    }
    
    // Insert default payment settings
    const { error: insertError } = await supabase
      .from('payment_settings')
      .upsert([
        {
          method_type: 'bank_transfer',
          settings: {
            account_name: 'Cravings Delight Ltd',
            account_number: '',
            sort_code: '',
            bank_name: '',
            iban: '',
            swift: ''
          }
        },
        {
          method_type: 'paypal',
          settings: {
            email: '',
            business_name: 'Cravings Delight'
          }
        },
        {
          method_type: 'stripe',
          settings: {
            publishable_key: '',
            webhook_endpoint: ''
          }
        }
      ], { onConflict: 'method_type' });
    
    if (insertError) {
      console.error('Error inserting payment settings:', insertError);
      return false;
    }
    
    // Create the fixed function
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION generate_invoice_number()
        RETURNS TEXT AS $$
        DECLARE
          next_number INTEGER;
          new_invoice_number TEXT;
        BEGIN
          SELECT COALESCE(MAX(CAST(SUBSTRING(i.invoice_number FROM 4) AS INTEGER)), 1000) + 1
          INTO next_number
          FROM invoices i
          WHERE i.invoice_number ~ '^INV[0-9]+$';
          
          new_invoice_number := 'INV' || next_number::TEXT;
          
          RETURN new_invoice_number;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (functionError) {
      console.error('Error creating function:', functionError);
      return false;
    }
    
    // Create trigger function
    const { error: triggerFuncError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION set_invoice_number()
        RETURNS TRIGGER AS $$
        BEGIN
          IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
            NEW.invoice_number := generate_invoice_number();
          END IF;
          NEW.updated_at := NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (triggerFuncError) {
      console.error('Error creating trigger function:', triggerFuncError);
      return false;
    }
    
    // Create trigger
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER trigger_set_invoice_number
          BEFORE INSERT OR UPDATE ON invoices
          FOR EACH ROW
          EXECUTE FUNCTION set_invoice_number();
      `
    });
    
    if (triggerError) {
      console.error('Error creating trigger:', triggerError);
      return false;
    }
    
    console.log('Invoice system setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Setup failed:', error);
    return false;
  }
}