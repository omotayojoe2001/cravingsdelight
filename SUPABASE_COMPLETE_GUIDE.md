# Complete Supabase Implementation Guide

## What This Does

This setup allows you to manage EVERYTHING from Supabase dashboard:

### ✅ What Gets Saved Automatically:
1. **Page Views** - Track every page visit
2. **Orders** - Full order details with items, sizes, spice levels
3. **Order Items** - Detailed breakdown (2L, 3L, Half Cooler, spice level, customization)
4. **Catering Requests** - All catering inquiries
5. **Reviews** - Customer feedback

### ✅ What You Can Edit from Supabase:
1. **Products** - Add, edit, delete menu items
2. **Prices** - Change prices for any size (2L, 3L, Full Cooler, etc)
3. **Contact Email** - Update business email
4. **Instagram** - Change Instagram handle/URL
5. **WhatsApp Number** - Update WhatsApp contact
6. **Location** - Change business location
7. **Order Processing Time** - Edit delivery timeframes
8. **Product Images** - Change product photos
9. **Product Descriptions** - Update menu descriptions

## Setup Steps

### 1. Run SQL in Supabase
Copy entire `database.sql` file and paste into Supabase SQL Editor, then click Run.

### 2. Install Package
```bash
npm install @supabase/supabase-js
```

### 3. Migrate Existing Products
After running SQL, you need to populate products table with your menu items.
Go to Supabase > Table Editor > products > Insert rows manually or run this SQL:

```sql
-- Example: Insert one product
INSERT INTO products (id, name, description, price, sizes, category, image) VALUES
('jollof-rice', 'Jollof Rice', 'Our signature Jollof...', 30.00, 
 '{"2L": 30, "3L": 40, "Full Cooler": 110, "Half Cooler": 70}'::jsonb,
 'rice', 'https://images.unsplash.com/...');
```

## How to Manage from Supabase

### Edit Contact Information
1. Go to Supabase > Table Editor > site_settings
2. Find row with `setting_key` = 'contact_email'
3. Click edit, change `setting_value`
4. Website updates automatically!

### Add New Product
1. Go to Supabase > Table Editor > products
2. Click "Insert row"
3. Fill in: id, name, description, price, sizes (JSON), category, image
4. Save - appears on website immediately!

### Edit Product Price
1. Go to products table
2. Find product
3. Edit `sizes` field (JSON format):
   ```json
   {"2L": 30, "3L": 40}
   ```
4. Save - price updates on website!

### Approve Reviews
1. Go to reviews table
2. Find review
3. Change `is_approved` from false to true
4. Review appears on website!

### View Orders
1. Go to orders table - see all orders
2. Go to order_items table - see detailed breakdown with sizes, spice levels

### Track Page Views
1. Go to page_views table
2. See which pages customers visit most
3. Use for analytics

## What Gets Tracked in Orders

When customer places order, saves:
- Customer name, email, phone, address
- Each item with:
  - Product name
  - Quantity
  - Size selected (2L, 3L, Full Cooler, etc)
  - Spice level (Mild, Medium, Hot)
  - Customization notes
  - Unit price
  - Total price
- Payment method
- Order status

## Security

- Public can: View products, insert orders, insert reviews, track page views
- Admin (you) can: Edit everything when logged into Supabase
- Row Level Security enabled - data is protected
