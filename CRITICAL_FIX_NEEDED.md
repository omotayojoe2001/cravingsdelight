# CRITICAL: Database Permissions Issue

## Problem
Orders, reviews, and catering requests are NOT being saved because Supabase is blocking anonymous users from inserting data.

## Solution
Run the SQL script `fix-rls-policies.sql` in Supabase SQL Editor

### Steps:
1. Go to Supabase Dashboard
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy and paste ALL content from `fix-rls-policies.sql`
5. Click "Run" button
6. You should see "Success. No rows returned"

## What This Fixes:
✅ Orders will save to database
✅ Reviews will save to database  
✅ Catering requests will save to database
✅ Admin can view all data
✅ Admin can update order status, approve reviews, etc.

## After Running SQL:
1. Test placing an order on frontend
2. Check `/admin/orders` - order should appear
3. Test leaving a review
4. Check `/admin/reviews` - review should appear
5. Test catering request
6. Check `/admin/catering` - request should appear

## Order Details Visible in Admin
When you click on an order in admin, you'll see:
- Customer name, email, phone
- Shipping address
- Delivery notes
- **Each item with:**
  - Product name
  - Size selected (2L, 3L, Full Cooler, etc.)
  - Quantity
  - Spice level (Mild, Medium, Hot)
  - Customization notes
  - Unit price
  - Total price

All this data is already being captured in the code - it just needs the database permissions fixed!
