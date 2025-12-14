# Stripe Integration Troubleshooting

## Current Issues & Solutions

### 1. 401 Unauthorized Error
**Problem**: Stripe API returning 401 unauthorized
**Possible Causes**:
- Live keys not activated in Stripe dashboard
- Keys copied incorrectly
- Account not fully verified

**Solutions**:
1. **Verify Stripe Account**: Ensure your Stripe account is fully activated for live payments
2. **Check Key Format**: 
   - Publishable key should start with `pk_live_`
   - Secret key should start with `sk_live_`
3. **Test with Test Keys First**: Switch back to test keys to verify integration works

### 2. Connection Refused Error
**Problem**: Backend server not running
**Solution**: Start the backend server:
```bash
npm run server
```
Or run both frontend and backend:
```bash
npm run dev:full
```

## Quick Fix Steps

### Step 1: Start Backend Server
```bash
# In your project directory
npm run server
```
You should see: "🚀 Stripe payment server running on port 3001"

### Step 2: Verify Stripe Keys
1. Log into your Stripe dashboard
2. Go to Developers > API Keys
3. Ensure live mode is activated
4. Copy the keys again if needed

### Step 3: Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill in form details
4. Use a real credit card (live mode)
5. Check Stripe dashboard for payment

## Fallback Behavior
The checkout form now includes fallback handling:
- If backend server is down, it will create payment method directly
- Shows appropriate error messages
- Continues with order processing

## Live vs Test Mode
- **Test Keys**: `pk_test_...` and `sk_test_...`
- **Live Keys**: `pk_live_...` and `sk_live_...`
- **Current**: Using live keys for real payments

## Next Steps
1. Ensure Stripe account is fully activated
2. Start backend server: `npm run server`
3. Test with real payment details
4. Monitor Stripe dashboard for transactions