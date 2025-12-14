# Supabase Database Setup

## Installation

```bash
npm install @supabase/supabase-js
```

## Database Tables to Create

Run these SQL commands in your Supabase SQL Editor:

### 1. Orders Table
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Catering Requests Table
```sql
CREATE TABLE catering_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  event_date DATE,
  event_location TEXT NOT NULL,
  number_of_guests INTEGER NOT NULL,
  requirements TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_sent_at TIMESTAMP WITH TIME ZONE
);
```

### 3. Reviews Table
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public to insert
CREATE POLICY "Allow public insert" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON catering_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON reviews FOR INSERT TO anon WITH CHECK (true);

-- Allow public to read reviews
CREATE POLICY "Allow public read" ON reviews FOR SELECT TO anon USING (true);
```

## Usage Examples

### Save Order
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('orders')
  .insert({
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '1234567890',
    shipping_address: '123 Main St',
    items: cartItems,
    total_amount: 50.00,
    payment_method: 'Stripe',
    payment_status: 'paid',
    order_status: 'processing'
  });
```

### Save Catering Request
```typescript
const { data, error } = await supabase
  .from('catering_requests')
  .insert({
    requester_name: 'Jane Smith',
    requester_email: 'jane@example.com',
    requester_phone: '0987654321',
    event_date: '2024-12-25',
    event_location: 'Hull Community Center',
    number_of_guests: 50,
    requirements: 'Need Jollof rice and Peppersoup'
  });
```

### Save Review
```typescript
const { data, error } = await supabase
  .from('reviews')
  .insert({
    customer_name: 'Bob Johnson',
    rating: 5,
    review_text: 'Amazing food!'
  });
```

### Fetch Reviews
```typescript
const { data, error } = await supabase
  .from('reviews')
  .select('*')
  .order('submitted_at', { ascending: false });
```

## Next Steps

1. Run the SQL commands in Supabase SQL Editor
2. Update the components to save data:
   - CheckoutForm.tsx → Save orders
   - CateringForm.tsx → Save catering requests
   - ReviewSection.tsx → Save and display reviews
3. Test the integration
4. Set up email notifications (optional)
