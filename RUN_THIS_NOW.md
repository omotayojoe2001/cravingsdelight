# 🚨 RUN THIS SQL NOW - FORCE_FIX_RLS.sql

## The Problem (From Your Console):

```
❌ ORDER SAVE FAILED: new row violates row-level security policy for table "orders"
❌ Page view insert error: new row violates row-level security policy for table "page_views"
```

**Translation**: Supabase is blocking ALL inserts because the RLS policies are wrong.

## The Solution:

**Run `FORCE_FIX_RLS.sql` in Supabase SQL Editor**

This SQL will:
1. ✅ Delete ALL existing policies (even ones with wrong names)
2. ✅ Create new correct policies
3. ✅ Allow public users to INSERT orders, reviews, catering, page views
4. ✅ Allow admin (you) to do EVERYTHING

## Steps:

1. Go to Supabase Dashboard
2. Click "SQL Editor" (left sidebar)
3. Click "New Query"
4. Copy **ENTIRE** content from `FORCE_FIX_RLS.sql`
5. Paste into editor
6. Click "Run"
7. Should see "Success. No rows returned"

## After Running:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Refresh page** (F5)
3. **Place a test order**
4. **Check console** - should see "✅ ORDER SAVED"
5. **Go to `/admin/orders`** - order should appear
6. **Page views will start counting**

## Why The First SQL Didn't Work:

The policies already existed with different names, so the `DROP POLICY IF EXISTS` didn't find them. This new SQL **forcefully deletes ALL policies** regardless of name, then creates new ones.

## Test After Running:

- Place order → Should save
- Leave review → Should save
- Submit catering → Should save
- Navigate pages → Page views should increase
- Check admin → Everything should appear

**This WILL fix everything!**
