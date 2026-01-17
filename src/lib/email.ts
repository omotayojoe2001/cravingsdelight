async function callEmailAPI(type: string, data: any) {
  try {
    console.log('🔧 DEBUG: Email API call started');
    console.log('🔧 DEBUG: Email type:', type);
    console.log('🔧 DEBUG: Email data:', JSON.stringify(data, null, 2));
    
    // Use production URL for email API since it's serverless
    const apiUrl = import.meta.env.DEV 
      ? 'https://cravingsdelight.vercel.app/api/send-email'
      : '/api/send-email';
    
    console.log('🔧 DEBUG: API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    console.log('🔧 DEBUG: Response status:', response.status);
    console.log('🔧 DEBUG: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DEBUG: API error response:', errorText);
      throw new Error(`Email API failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ DEBUG: Email API success:', result);
    return result;
  } catch (error) {
    console.error('❌ DEBUG: Email API error:', error);
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

export async function sendInvoiceUpdateEmail(customerEmail: string, invoiceData: any) {
  return await callEmailAPI('invoice_update', {
    customer_email: customerEmail,
    ...invoiceData
  });
}

export async function sendInvoiceUpdateNotification(customerEmail: string, invoiceData: any) {
  return await callEmailAPI('order', {
    customer_email: customerEmail,
    customer_name: invoiceData.customer_name,
    items: invoiceData.items,
    total: invoiceData.total,
    delivery_address: '', // Blank delivery address
    phone: invoiceData.phone || '',
    subject_override: `Invoice Updated - ${invoiceData.invoice_number}`,
    custom_message: `Your invoice ${invoiceData.invoice_number} has been updated. Please review the updated items and pricing below:`
  });
}