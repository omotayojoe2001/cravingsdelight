# ⚠️ CRITICAL: YOU MUST RUN THIS SQL FIRST

## Why Orders Show 0

**The orders ARE being saved to the database**, but Supabase RLS (Row Level Security) is **BLOCKING you from seeing them** in the admin panel.

## The Problem

When you place an order:
1. ✅ Order saves to database successfully
2. ❌ Admin panel can't read it (RLS blocks it)
3. ❌ Shows "0 orders" even though data exists

## The Solution

**Run `fix-rls-policies.sql` in Supabase SQL Editor**

### Steps:
1. Open Supabase Dashboard
2. Click "SQL Editor" (left sidebar)
3. Click "New Query"
4. Copy ENTIRE content from `fix-rls-policies.sql`
5. Paste into editor
6. Click "Run"
7. Should see "Success. No rows returned"

## After Running SQL

Refresh your admin panel:
- Orders will appear in `/admin/orders`
- Reviews will appear in `/admin/reviews`  
- Catering will appear in `/admin/catering`
- Page views will update properly

## What the SQL Does

- ✅ Allows public users to INSERT orders, reviews, catering
- ✅ Allows admin (you) to READ and UPDATE everything
- ✅ Keeps data secure (public can't read other people's orders)

**Without running this SQL, the admin panel will stay blank even though data is being saved!**
