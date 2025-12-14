const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Only show error if key is actually missing or placeholder
if (!publishableKey || publishableKey === 'your_stripe_publishable_key_here') {
  console.error('❌ STRIPE ERROR: Missing or invalid publishable key');
  console.error('Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables');
} else {
  console.log('✅ Stripe key loaded successfully');
}

export const stripeConfig = {
  publishableKey,
};
