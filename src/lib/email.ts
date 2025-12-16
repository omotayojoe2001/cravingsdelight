async function callEmailAPI(type: string, data: any) {
  try {
    // Use production URL for email API since it's serverless
    const apiUrl = import.meta.env.DEV 
      ? 'https://cravingsdelight.vercel.app/api/send-email'
      : '/api/send-email';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error(`Email API failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Email API error:', error);
    throw error;
  }
}

export async function sendOrderConfirmation(customerEmail: string, orderData: any) {
  return await callEmailAPI('order', {
    customer_email: customerEmail,
    ...orderData
  });
}

export async function sendCateringConfirmation(customerEmail: string, cateringData: any) {
  return await callEmailAPI('catering', {
    customer_email: customerEmail,
    ...cateringData
  });
}

export async function sendReviewNotification(reviewData: any) {
  return await callEmailAPI('review', reviewData);
}

export async function sendInvoiceEmail(customerEmail: string, invoiceData: any) {
  return await callEmailAPI('invoice', {
    customer_email: customerEmail,
    ...invoiceData
  });
}

export async function sendStatusUpdateEmail(customerEmail: string, statusData: any) {
  return await callEmailAPI('status_update', {
    customer_email: customerEmail,
    ...statusData
  });
}