# Complete Supabase Database Breakdown

## 📊 ALL 7 TABLES IN YOUR DATABASE

---

## 1️⃣ **products** Table (27 Products)

**What it stores:** All menu items customers can order

**Columns:**
- `id` (TEXT) - Unique product ID (e.g., "jollof-rice")
- `name` (TEXT) - Product name (e.g., "Jollof Rice")
- `description` (TEXT) - Full description
- `price` (DECIMAL) - Base price (lowest price)
- `sizes` (JSONB) - All size options with prices
  - Example: `{"2L": 30, "3L": 40}`
  - Example: `{"Full Cooler": 110, "Half Cooler": 70}`
  - Example: `{"1 Piece": 3}`
- `category` (TEXT) - rice, soup, sides, or special
- `image` (TEXT) - Image URL
- `is_active` (BOOLEAN) - Show on website? (true/false)
- `created_at` (TIMESTAMP) - When added
- `updated_at` (TIMESTAMP) - Last edited

**Example Row:**
```
id: jollof-rice
name: Jollof Rice
description: Our signature Smokey Jollof is made with pepper mix...
price: 30.00
sizes: {"2L": 30, "3L": 40}
category: rice
image: https://images.unsplash.com/...
is_active: true
created_at: 2024-01-15 10:30:00
updated_at: 2024-01-15 10:30:00
```

**Total Products:** 27
- 10 Soup Bowls
- 6 Food Bowls
- 2 Food Coolers
- 4 Protein Coolers
- 3 Extras

---

## 2️⃣ **orders** Table

**What it stores:** Customer orders (main order info)

**Columns:**
- `id` (UUID) - Unique order ID (auto-generated)
- `customer_name` (TEXT) - Full name
- `customer_email` (TEXT) - Email address
- `customer_phone` (TEXT) - Phone number
- `shipping_address` (TEXT) - Delivery address
- `delivery_notes` (TEXT) - Special delivery instructions
- `items` (JSONB) - Full cart snapshot (all items)
- `total_amount` (DECIMAL) - Total order value in £
- `payment_method` (TEXT) - "Stripe" or "PayPal"
- `payment_status` (TEXT) - "pending" or "paid"
- `order_status` (TEXT) - "processing", "shipped", "delivered", "cancelled"
- `created_at` (TIMESTAMP) - Order date/time

**Example Row:**
```
id: 123e4567-e89b-12d3-a456-426614174000
customer_name: John Doe
customer_email: john@example.com
customer_phone: 07741069639
shipping_address: 123 Main St, Hull, HU1 2AB, UK
delivery_notes: Ring doorbell twice
items: [full cart JSON]
total_amount: 85.00
payment_method: Stripe
payment_status: paid
order_status: processing
created_at: 2024-01-15 14:30:00
```

---

## 3️⃣ **order_items** Table

**What it stores:** Detailed breakdown of each item in every order

**Columns:**
- `id` (UUID) - Unique item ID
- `order_id` (UUID) - Links to orders table
- `product_id` (TEXT) - Links to products table
- `product_name` (TEXT) - Product name (snapshot)
- `quantity` (INTEGER) - How many ordered
- `size_selected` (TEXT) - Which size: "2L", "3L", "Full Cooler", etc.
- `spice_level` (TEXT) - "Mild", "Medium", or "Hot"
- `customization_note` (TEXT) - Special requests
- `unit_price` (DECIMAL) - Price per item
- `total_price` (DECIMAL) - Quantity × Unit Price
- `created_at` (TIMESTAMP) - When added

**Example Rows:**
```
Row 1:
id: abc-123
order_id: 123e4567-e89b-12d3-a456-426614174000
product_id: jollof-rice
product_name: Jollof Rice
quantity: 2
size_selected: 3L
spice_level: Medium
customization_note: Extra spicy please
unit_price: 40.00
total_price: 80.00
created_at: 2024-01-15 14:30:00

Row 2:
id: def-456
order_id: 123e4567-e89b-12d3-a456-426614174000
product_id: efo-riro
product_name: Efo Riro
quantity: 1
size_selected: 2L
spice_level: Hot
customization_note: No fish
unit_price: 60.00
total_price: 60.00
created_at: 2024-01-15 14:30:00
```

---

## 4️⃣ **catering_requests** Table

**What it stores:** Catering inquiries from customers

**Columns:**
- `id` (UUID) - Unique request ID
- `requester_name` (TEXT) - Customer name
- `requester_email` (TEXT) - Email
- `requester_phone` (TEXT) - Phone
- `event_date` (DATE) - Event date (optional)
- `event_location` (TEXT) - Venue address
- `number_of_guests` (INTEGER) - Guest count
- `requirements` (TEXT) - Detailed requirements
- `status` (TEXT) - "pending", "contacted", "confirmed", "cancelled"
- `submitted_at` (TIMESTAMP) - When submitted
- `response_sent_at` (TIMESTAMP) - When you replied (optional)

**Example Row:**
```
id: 789-xyz
requester_name: Jane Smith
requester_email: jane@example.com
requester_phone: 07741069639
event_date: 2024-02-14
event_location: Hull Community Center, Hull
number_of_guests: 50
requirements: Need Jollof rice, Efo Riro, and Peppersoup for 50 people
status: pending
submitted_at: 2024-01-15 16:00:00
response_sent_at: null
```

---

## 5️⃣ **reviews** Table

**What it stores:** Customer reviews and ratings

**Columns:**
- `id` (UUID) - Unique review ID
- `customer_name` (TEXT) - Name (optional)
- `rating` (INTEGER) - 1 to 5 stars (optional)
- `review_text` (TEXT) - Review message
- `is_approved` (BOOLEAN) - Show on website? (true/false)
- `submitted_at` (TIMESTAMP) - When submitted

**Example Row:**
```
id: review-123
customer_name: Bob Johnson
rating: 5
review_text: Amazing food! The Jollof rice was perfect!
is_approved: false (you must approve to show on website)
submitted_at: 2024-01-15 18:00:00
```

---

## 6️⃣ **page_views** Table

**What it stores:** Every page visit for analytics

**Columns:**
- `id` (UUID) - Unique view ID
- `page_path` (TEXT) - URL path (e.g., "/menu", "/product/jollof-rice")
- `page_title` (TEXT) - Page title
- `referrer` (TEXT) - Where they came from
- `user_agent` (TEXT) - Browser info
- `ip_address` (TEXT) - IP address (optional)
- `viewed_at` (TIMESTAMP) - When viewed

**Example Row:**
```
id: view-456
page_path: /menu
page_title: Menu - Cravings Delight
referrer: https://google.com
user_agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
ip_address: null
viewed_at: 2024-01-15 12:00:00
```

**Analytics You Can Get:**
- Most visited pages
- Traffic sources
- Peak visit times
- Popular products

---

## 7️⃣ **site_settings** Table

**What it stores:** Editable website settings

**Columns:**
- `id` (UUID) - Unique setting ID
- `setting_key` (TEXT) - Setting name (unique)
- `setting_value` (TEXT) - Setting value
- `setting_type` (TEXT) - "text", "email", "phone", "url"
- `description` (TEXT) - What it's for
- `updated_at` (TIMESTAMP) - Last changed

**All 7 Settings:**
```
1. contact_email = cravingsdelight2025@gmail.com
2. instagram_handle = @cravings_delighthull
3. instagram_url = https://instagram.com/cravings_delighthull
4. whatsapp_number = +447741069639
5. business_location = Hull, United Kingdom
6. order_processing_time = 3-5 WORKING DAYS AFTER PAYMENT
7. shipping_note = Once order is placed please give 4-5 working days...
```

**To Change Any Setting:**
1. Go to Supabase > Table Editor > site_settings
2. Find the row (e.g., contact_email)
3. Edit setting_value
4. Save - website updates instantly!

---

## 🔐 SECURITY (Row Level Security)

**Public Can:**
- ✅ View active products
- ✅ View approved reviews
- ✅ View site settings
- ✅ Insert orders
- ✅ Insert order items
- ✅ Insert catering requests
- ✅ Insert reviews
- ✅ Insert page views

**Public Cannot:**
- ❌ Edit products
- ❌ Delete orders
- ❌ Approve reviews
- ❌ View other customers' data

**Admin (You) Can:**
- ✅ Everything - full access to all tables

---

## 📈 WHAT GETS TRACKED AUTOMATICALLY

**When Customer Visits Page:**
- ✅ Page path, title, referrer → `page_views`

**When Customer Orders:**
- ✅ Name, email, phone, address → `orders`
- ✅ Payment method (Stripe/PayPal) → `orders`
- ✅ Each item with size, spice, quantity → `order_items`
- ✅ Customization notes → `order_items`
- ✅ Total amount → `orders`

**When Customer Requests Catering:**
- ✅ All details → `catering_requests`

**When Customer Leaves Review:**
- ✅ Review text, rating, name → `reviews`

---

## 📊 TOTAL DATABASE SIZE

- **7 Tables**
- **27 Products**
- **7 Site Settings**
- **Unlimited** orders, reviews, catering requests, page views

**Everything is saved forever and accessible from Supabase dashboard!**
