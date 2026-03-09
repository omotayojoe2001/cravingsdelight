# Supabase Keep-Alive Setup

## What This Does:
Prevents Supabase from pausing your project due to inactivity by automatically pinging the database every hour.

## Setup Steps:

### 1. Add Environment Variable in Vercel:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: `your-secret-key-here` (generate a random string)
   - **Environment**: All (Production, Preview, Development)
4. Click Save

### 2. Deploy to Vercel:
The `vercel.json` file configures a cron job that runs every hour.

### 3. Verify It's Working:
- Check Vercel Dashboard → Deployments → Functions
- You should see `/api/keep-alive` listed
- Supabase will stay active automatically

## How It Works:
- Vercel cron job runs every hour: `0 * * * *`
- Makes a simple query to Supabase
- Keeps your database active
- No manual intervention needed

## Alternative (If Cron Doesn't Work):
Use a free service like:
- **UptimeRobot** (https://uptimerobot.com)
- **Cron-job.org** (https://cron-job.org)
- Ping: `https://your-site.vercel.app/api/keep-alive`
- Interval: Every 30 minutes

Your Supabase will never pause! 🚀