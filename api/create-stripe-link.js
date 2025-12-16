export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const { invoice_number, customer_email, amount, currency = 'gbp', description } = req.body;

  try {
    // Create Stripe payment link
    const response = await fetch('https://api.stripe.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'line_items[0][price_data][currency]': currency,
        'line_items[0][price_data][product_data][name]': `Invoice ${invoice_number}`,
        'line_items[0][price_data][product_data][description]': description,
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][quantity]': '1',
        'metadata[invoice_number]': invoice_number,
        'metadata[customer_email]': customer_email,
        'after_completion[type]': 'hosted_confirmation',
        'after_completion[hosted_confirmation][custom_message]': `Thank you for your payment! Your invoice ${invoice_number} has been paid successfully.`
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const paymentLink = await response.json();
    
    res.status(200).json({ 
      success: true, 
      payment_link: paymentLink.url,
      stripe_id: paymentLink.id
    });
  } catch (error) {
    console.error('Stripe payment link error:', error);
    res.status(500).json({ error: error.message });
  }
}