# Debug Instructions - Find Out What's Wrong

## Step 1: Check Browser Console

1. Open your website
2. Press F12 to open Developer Tools
3. Click "Console" tab
4. Clear the console (trash icon)

## Step 2: Place a Test Order

1. Add item to cart
2. Go to checkout
3. Fill out form
4. Click "Pay"
5. **WATCH THE CONSOLE**

## What You Should See:

### If Order Saves Successfully:
```
Attempting to save order...
✅ ORDER SAVED: {id: "...", customer_name: "..."}
✅ ORDER ITEMS SAVED
Order placed successfully!
```

### If Order Fails:
```
Attempting to save order...
❌ ORDER SAVE FAILED: {message: "..."}
```

## Step 3: Check Admin Orders Page

1. Go to `/admin/orders`
2. **WATCH THE CONSOLE**

### What You Should See:
```
Fetching orders...
✅ ORDERS FETCHED: 2 orders
```

### If You See Error:
```
❌ FETCH ORDERS ERROR: {message: "..."}
```

## Step 4: Check Supabase Directly

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Click "orders" table
4. **Do you see any rows?**

### If YES (rows exist):
- Problem: RLS policy blocking admin from reading
- Solution: Check if you're logged in to admin

### If NO (no rows):
- Problem: Orders not saving at all
- Check console error message
- Likely: RLS blocking INSERT

## Step 5: Check Page Views

1. Go to Supabase > Table Editor > page_views
2. Click "Refresh" button
3. **Do you see new rows being added?**

### If NO:
- RLS is blocking page view inserts
- Run the SQL again

## Common Issues:

### "permission denied for table orders"
- RLS policy not set correctly
- Run `fix-rls-policies.sql` again

### "relation does not exist"
- Table wasn't created
- Run `database-update.sql`

### "JWT expired" or "Invalid JWT"
- You're not logged in as admin
- Go to `/admin/login` and login again

## Report Back:

Tell me EXACTLY what you see in the console when:
1. Placing an order
2. Viewing admin orders page
3. Looking at Supabase table editor

This will tell us exactly what's broken!
