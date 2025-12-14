# Stripe Integration Guide

## Current Status
The application currently simulates payment processing. To enable real Stripe payments, follow these steps:

## Setup Instructions

### 1. Install Stripe Dependencies
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Backend Setup (Required)
Stripe requires a backend server to create payment intents securely. You need to:

1. Create a backend API endpoint (Node.js/Express, Python/Flask, etc.)
2. Install Stripe SDK on backend: `npm install stripe`
3. Create payment intent endpoint:

```javascript
// Example Node.js endpoint
const stripe = require('stripe')('your_stripe_secret_key_here');

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'gbp',
  });
  
  res.json({ clientSecret: paymentIntent.client_secret });
});
```

### 3. Frontend Integration

Update `CheckoutForm.tsx` to use Stripe Elements:

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeConfig } from '@/config/stripe';

const stripePromise = loadStripe(stripeConfig.publishableKey);

// Wrap checkout form with Elements provider
<Elements stripe={stripePromise}>
  <CheckoutFormContent />
</Elements>
```

### 4. Environment Variables
The publishable key is already configured in `.env.local`:
```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**IMPORTANT**: Never expose the secret key (`sk_test_...`) in frontend code. It must only be used on your backend server.

## PayPal Integration
For PayPal, install: `npm install @paypal/react-paypal-js`

## Testing
Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## Production Checklist
- [ ] Replace test keys with live keys
- [ ] Set up webhook endpoints for payment confirmations
- [ ] Implement proper error handling
- [ ] Add payment receipt emails
- [ ] Set up order tracking system
