# Troubleshooting Guide

## Page Views Not Showing

**The policy already exists, so tracking should work!**

### Check if tracking is working:

1. **Open browser console** (F12)
2. Navigate to different pages on your site
3. Look for messages: `"Page view tracked: /menu"` etc.

### If you see errors in console:

**Error: "permission denied"**
- Go to Supabase > Authentication > Policies
- Find `page_views` table
- Make sure this policy exists:
  ```
  Policy name: Allow public insert page views
  Operation: INSERT
  Target roles: anon
  USING expression: true
  ```

**Error: "relation does not exist"**
- The `page_views` table wasn't created
- Run `database-update.sql` in Supabase SQL Editor

### If no errors but still not showing in Analytics:

**Check date filter:**
- Analytics page has date filter (Today, 7 days, 30 days, etc.)
- Make sure you're looking at the right time period
- Try "Last 30 days" to see all data

**Check Supabase directly:**
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select `page_views` table
4. See if rows are being added

### Still not working?

**Test manually in Supabase SQL Editor:**
```sql
-- Check if table exists
SELECT * FROM page_views LIMIT 10;

-- Check total count
SELECT COUNT(*) FROM page_views;

-- Check recent views
SELECT * FROM page_views 
ORDER BY viewed_at DESC 
LIMIT 20;
```

## Product Edits Not Reflecting

**Now fixed!** Frontend fetches from database.

If still not working:
1. Hard refresh browser (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify product `is_active = true` in database

## Image Upload

**Current**: Uses URL input
**To add file upload**: Need Supabase Storage setup

Steps:
1. Create storage bucket in Supabase
2. Set bucket to public
3. Update ProductEdit.tsx with file upload
4. Upload to storage, get URL, save to database
