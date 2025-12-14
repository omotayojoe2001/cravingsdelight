# What Gets Saved to Supabase Database

## ✅ CONFIRMED: Everything is Already Being Saved!

### When Customer Clicks on Product (Menu or Catering):

**Product Detail Page Selections:**
1. ✅ **Size Selected** (2L, 3L, Full Cooler, Half Cooler) - SAVED
2. ✅ **Quantity** (1, 2, 3, etc) - SAVED
3. ✅ **Spice Level** (Mild, Medium, Hot) - SAVED
4. ✅ **Customization Notes** (special requests) - SAVED

### When Customer Proceeds to Checkout:

**Checkout Form Data:**
1. ✅ **Full Name** - SAVED to `orders.customer_name`
2. ✅ **Email** - SAVED to `orders.customer_email`
3. ✅ **Phone Number** - SAVED to `orders.customer_phone`
4. ✅ **Delivery Address** - SAVED to `orders.shipping_address`
5. ✅ **Delivery Notes** - SAVED to `orders.delivery_notes`
6. ✅ **Payment Method** (Stripe or PayPal) - SAVED to `orders.payment_method`
7. ✅ **Terms Accepted** - Validated (must be checked to proceed)
8. ✅ **Total Amount** - SAVED to `orders.total_amount`

### Detailed Order Items Saved:

For EACH item in the order, saved to `order_items` table:
1. ✅ **Product ID** - Which product
2. ✅ **Product Name** - Name of dish
3. ✅ **Quantity** - How many
4. ✅ **Size Selected** - 2L, 3L, Full Cooler, Half Cooler
5. ✅ **Spice Level** - Mild, Medium, Hot
6. ✅ **Customization Note** - Special requests
7. ✅ **Unit Price** - Price per item
8. ✅ **Total Price** - Quantity × Unit Price

## Database Tables Structure

### `orders` Table
```
- id (UUID)
- customer_name ✅
- customer_email ✅
- customer_phone ✅
- shipping_address ✅
- delivery_notes ✅
- items (JSONB - full cart)
- total_amount ✅
- payment_method ✅ (Stripe/PayPal)
- payment_status (paid/pending)
- order_status (processing/shipped/delivered)
- created_at (timestamp)
```

### `order_items` Table (Detailed Breakdown)
```
- id (UUID)
- order_id (links to orders table)
- product_id ✅
- product_name ✅
- quantity ✅
- size_selected ✅ (2L, 3L, Full Cooler, etc)
- spice_level ✅ (Mild, Medium, Hot)
- customization_note ✅
- unit_price ✅
- total_price ✅
- created_at (timestamp)
```

## Example: What You'll See in Supabase

### Order Example:
```
Order ID: 123e4567-e89b-12d3-a456-426614174000
Customer: John Doe
Email: john@example.com
Phone: 07123456789
Address: 123 Main St, Hull, HU1 2AB
Payment: Stripe
Status: Processing
Total: £85.00
```

### Order Items Example:
```
Item 1:
- Product: Jollof Rice
- Quantity: 2
- Size: 3L
- Spice: Medium
- Note: "Extra spicy please"
- Price: £40.00 (£20 × 2)

Item 2:
- Product: Efo Riro
- Quantity: 1
- Size: 2L
- Spice: Hot
- Note: "No fish"
- Price: £60.00
```

## How to View in Supabase

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select `orders` table - See all orders
4. Select `order_items` table - See detailed breakdown
5. Click any row to see full details

## Summary

✅ **YES** - Size selection is saved
✅ **YES** - Quantity is saved
✅ **YES** - Spice level is saved
✅ **YES** - Customization notes are saved
✅ **YES** - Full name is saved
✅ **YES** - Email is saved
✅ **YES** - Phone is saved
✅ **YES** - Address is saved
✅ **YES** - Payment method is saved
✅ **YES** - Terms acceptance is validated

**Everything you requested is already implemented and working!**
