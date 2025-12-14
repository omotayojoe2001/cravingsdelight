import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// DEBUG: Log environment loading
console.log('🔧 DEBUG: Loading environment variables...');
console.log('🔧 DEBUG: STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('🔧 DEBUG: STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length || 0);
console.log('🔧 DEBUG: STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('🔧 DEBUG: Initializing Stripe with live keys...');
const stripe = new Stripe(stripeSecretKey);
console.log('✅ DEBUG: Stripe initialized successfully');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  console.log('🔧 DEBUG: Payment intent request received');
  console.log('🔧 DEBUG: Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { amount, currency = 'gbp', metadata = {} } = req.body;
    
    console.log('🔧 DEBUG: Parsed values - Amount:', amount, 'Currency:', currency);
    console.log('🔧 DEBUG: Metadata:', JSON.stringify(metadata, null, 2));

    if (!amount || amount <= 0) {
      console.log('❌ DEBUG: Invalid amount provided:', amount);
      return res.status(400).json({ error: 'Invalid amount' });
    }



    console.log('🔧 DEBUG: Creating real Stripe payment intent...');
    console.log('🔧 DEBUG: Stripe instance exists:', !!stripe);
    
    const paymentIntentData = {
      amount: Math.round(amount * 100), // Convert to pence
      currency,
      metadata,
    };
    
    console.log('🔧 DEBUG: Payment intent data:', JSON.stringify(paymentIntentData, null, 2));
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    
    console.log('✅ DEBUG: Stripe payment intent created successfully');
    console.log('🔧 DEBUG: Payment intent ID:', paymentIntent.id);
    console.log('🔧 DEBUG: Client secret exists:', !!paymentIntent.client_secret);

    const response = {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
    
    console.log('🔧 DEBUG: Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
    
  } catch (error) {
    console.error('❌ DEBUG: Payment intent creation failed');
    console.error('❌ DEBUG: Error type:', error.constructor.name);
    console.error('❌ DEBUG: Error message:', error.message);
    console.error('❌ DEBUG: Error code:', error.code);
    console.error('❌ DEBUG: Error type (Stripe):', error.type);
    console.error('❌ DEBUG: Full error:', error);
    
    res.status(500).json({ 
      error: error.message,
      errorType: error.type || error.constructor.name,
      errorCode: error.code
    });
  }
});

// Confirm payment endpoint
app.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      paymentIntent,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🔧 DEBUG: Health check requested');
  const healthData = {
    status: 'OK', 
    message: 'Stripe payment server is running',
    timestamp: new Date().toISOString(),
    mockMode: MOCK_MODE,
    stripeInitialized: !!stripe,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: PORT,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0
    }
  };
  console.log('🔧 DEBUG: Health check response:', JSON.stringify(healthData, null, 2));
  res.json(healthData);
});

// Debug endpoint
app.get('/debug', (req, res) => {
  console.log('🔧 DEBUG: Debug endpoint requested');
  const debugData = {
    server: {
      running: true,
      port: PORT,
      timestamp: new Date().toISOString()
    },
    stripe: {
      mockMode: MOCK_MODE,
      initialized: !!stripe,
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      keyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
      keyFormat: process.env.STRIPE_SECRET_KEY?.startsWith('sk_') ? 'valid' : 'invalid'
    },
    environment: process.env
  };
  res.json(debugData);
});

app.listen(PORT, () => {
  console.log(`🚀 Stripe payment server running on port ${PORT}`);
  console.log(`💳 Ready to process payments`);
  console.log('🔧 DEBUG: Server configuration:');
  console.log('  - Port:', PORT);
  console.log('  - Live Stripe Mode: ENABLED');
  console.log('  - Stripe initialized:', !!stripe);
  console.log('  - Environment file loaded:', !!process.env.STRIPE_SECRET_KEY);
  console.log('🔧 DEBUG: Available endpoints:');
  console.log('  - POST /create-payment-intent');
  console.log('  - POST /confirm-payment');
  console.log('  - GET /health');
}).on('error', (err) => {
  console.error('❌ DEBUG: Server startup error:', err);
  console.error('❌ DEBUG: Error code:', err.code);
  console.error('❌ DEBUG: Error message:', err.message);
});