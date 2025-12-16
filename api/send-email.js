export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = 'joshuaomotayo10@gmail.com';
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { type, data } = req.body;

  try {
    let emails = [];

    if (type === 'order') {
      const customerHtml = `
        <h2>Order Confirmation - Cravings Delight</h2>
        <p>Dear ${data.customer_name},</p>
        <p>Thank you for your order! We have received your order and it's being processed.</p>
        <h3>Order Details:</h3>
        <ul>
          ${data.items.map(item => `<li>${item.quantity}x ${item.name} - £${item.price}</li>`).join('')}
        </ul>
        <p><strong>Total: £${data.total}</strong></p>
        <p>Delivery Address: ${data.delivery_address}</p>
        <p>We'll process your order within 3-5 working days.</p>
        <p>Best regards,<br>Cravings Delight Team</p>
      `;

      const adminHtml = `
        <h2>New Order Received</h2>
        <p>A new order has been placed:</p>
        <h3>Customer: ${data.customer_name}</h3>
        <p>Email: ${data.customer_email}</p>
        <p>Phone: ${data.phone}</p>
        <h3>Order Items:</h3>
        <ul>
          ${data.items.map(item => `<li>${item.quantity}x ${item.name} - £${item.price}</li>`).join('')}
        </ul>
        <p><strong>Total: £${data.total}</strong></p>
        <p>Delivery Address: ${data.delivery_address}</p>
      `;

      emails = [
        { to: data.customer_email, subject: 'Order Confirmation - Cravings Delight', html: customerHtml },
        { to: ADMIN_EMAIL, subject: 'New Order Received from Cravings Delight', html: adminHtml }
      ];
    }

    if (type === 'catering') {
      const customerHtml = `
        <h2>Catering Request Received - Cravings Delight</h2>
        <p>Dear ${data.requester_name},</p>
        <p>Thank you for your catering request! We have received your booking and will contact you soon.</p>
        <h3>Event Details:</h3>
        <p>Date: ${data.event_date || 'TBD'}</p>
        <p>Time: ${data.event_time || 'TBD'}</p>
        <p>Location: ${data.event_location}</p>
        <p>Guests: ${data.number_of_guests}</p>
        ${data.selected_items ? `<h3>Selected Menu Items:</h3><ul>${data.selected_items.map(item => `<li>${item.quantity}x ${item.name} ${item.size ? `(${item.size})` : ''}</li>`).join('')}</ul>` : ''}
        <p>We'll be in touch within 24 hours to discuss your requirements.</p>
        <p>Best regards,<br>Cravings Delight Team</p>
      `;

      const adminHtml = `
        <h2>New Catering Request</h2>
        <p>A new catering request has been submitted:</p>
        <h3>Customer: ${data.requester_name}</h3>
        <p>Email: ${data.customer_email}</p>
        <p>Phone: ${data.requester_phone}</p>
        <h3>Event Details:</h3>
        <p>Date: ${data.event_date || 'TBD'}</p>
        <p>Time: ${data.event_time || 'TBD'}</p>
        <p>Location: ${data.event_location}</p>
        <p>Guests: ${data.number_of_guests}</p>
        <p>Requirements: ${data.requirements || 'None'}</p>
      `;

      emails = [
        { to: data.customer_email, subject: 'Catering Request Received - Cravings Delight', html: customerHtml },
        { to: ADMIN_EMAIL, subject: 'New Catering Request from Cravings Delight', html: adminHtml }
      ];
    }

    if (type === 'review') {
      const adminHtml = `
        <h2>New Review Submitted</h2>
        <p>A new review has been submitted:</p>
        <h3>Customer: ${data.customer_name}</h3>
        <p>Email: ${data.customer_email || 'Not provided'}</p>
        <p>Rating: ${data.rating}/5 stars</p>
        <p>Review: ${data.review_text}</p>
        <p>Please approve or reject this review in the admin panel.</p>
      `;

      emails = [
        { to: ADMIN_EMAIL, subject: 'New Review Submitted from Cravings Delight', html: adminHtml }
      ];
    }

    if (type === 'invoice') {
      const customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${data.invoice_number} - Cravings Delight</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">CRAVINGS DELIGHT</h1>
              <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 14px;">Premium Catering Services</p>
            </div>
            
            <!-- Invoice Header -->
            <div style="background-color: #1e293b; color: white; padding: 25px 30px; text-align: center;">
              <h2 style="margin: 0; font-size: 24px;">INVOICE ${data.invoice_number}</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.8;">Thank you for choosing Cravings Delight</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <h3 style="color: #1a202c; margin: 0 0 20px 0; font-size: 20px;">Dear ${data.customer_name},</h3>
              
              <p style="color: #4a5568; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">Thank you for choosing Cravings Delight for your catering needs. Please find your invoice details below:</p>
              
              <!-- Event Details Card -->
              <div style="background-color: #f7fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">📅 Event Details</h3>
                <div style="display: grid; gap: 8px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-weight: 500;">Date:</span>
                    <span style="color: #1e293b; font-weight: 600;">${data.event_date ? new Date(data.event_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-weight: 500;">Location:</span>
                    <span style="color: #1e293b; font-weight: 600;">${data.event_location}</span>
                  </div>
                </div>
              </div>
              
              <!-- Invoice Items -->
              <div style="margin: 30px 0;">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px;">🍽️ Invoice Items</h3>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <thead>
                      <tr style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">
                        <th style="padding: 15px; text-align: left; color: white; font-weight: 600;">Item</th>
                        <th style="padding: 15px; text-align: center; color: white; font-weight: 600;">Qty</th>
                        <th style="padding: 15px; text-align: right; color: white; font-weight: 600;">Price</th>
                        <th style="padding: 15px; text-align: right; color: white; font-weight: 600;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${data.items.map((item, index) => `
                        <tr style="${index % 2 === 0 ? 'background-color: #f8fafc;' : 'background-color: white;'}">
                          <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${item.name}</td>
                          <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">${item.quantity}</td>
                          <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #1e293b;">£${item.unit_price.toFixed(2)}</td>
                          <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">£${item.total.toFixed(2)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Invoice Summary -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0;">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px;">💰 Invoice Summary</h3>
                <div style="space-y: 10px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b;">Subtotal:</span>
                    <span style="color: #1e293b; font-weight: 600;">£${data.subtotal.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b;">Tax (${data.tax_rate}%):</span>
                    <span style="color: #1e293b; font-weight: 600;">£${data.tax_amount.toFixed(2)}</span>
                  </div>
                  ${data.delivery_fee > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b;">Delivery Fee:</span>
                      <span style="color: #1e293b; font-weight: 600;">£${data.delivery_fee.toFixed(2)}</span>
                    </div>
                  ` : ''}
                  ${data.discount_amount > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b;">Discount:</span>
                      <span style="color: #dc2626; font-weight: 600;">-£${data.discount_amount.toFixed(2)}</span>
                    </div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; padding: 15px 0; background: linear-gradient(135deg, #10b981, #059669); margin: 15px -25px -25px -25px; padding-left: 25px; padding-right: 25px; border-radius: 0 0 12px 12px;">
                    <span style="color: white; font-size: 18px; font-weight: bold;">Total Amount:</span>
                    <span style="color: white; font-size: 20px; font-weight: bold;">£${data.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              ${data.due_date ? `
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #92400e; margin: 0; font-weight: 600;">⏰ Payment Due: ${new Date(data.due_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              ` : ''}
              
              ${data.notes ? `
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                  <h4 style="color: #1e40af; margin: 0 0 10px 0;">📝 Notes:</h4>
                  <p style="color: #1e40af; margin: 0; line-height: 1.6;">${data.notes}</p>
                </div>
              ` : ''}
        
              <!-- Payment Information -->
              <div style="margin: 30px 0;">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px;">💳 Payment Information</h3>
                ${data.payment_method === 'bank_transfer' && data.bank_details ? `
                  <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border: 1px solid #cbd5e0; border-radius: 12px; padding: 25px; margin: 15px 0;">
                    <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center;">
                      🏦 Bank Transfer Details
                    </h4>
                    <div style="background-color: white; border-radius: 8px; padding: 20px;">
                      <div style="display: grid; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                          <span style="color: #64748b; font-weight: 500;">Account Name:</span>
                          <span style="color: #1e293b; font-weight: 600;">${data.bank_details.account_name || 'Cravings Delight Ltd'}</span>
                        </div>
                        ${data.bank_details.account_number ? `
                          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="color: #64748b; font-weight: 500;">Account Number:</span>
                            <span style="color: #1e293b; font-weight: 600; font-family: monospace;">${data.bank_details.account_number}</span>
                          </div>
                        ` : ''}
                        ${data.bank_details.sort_code ? `
                          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="color: #64748b; font-weight: 500;">Sort Code:</span>
                            <span style="color: #1e293b; font-weight: 600; font-family: monospace;">${data.bank_details.sort_code}</span>
                          </div>
                        ` : ''}
                        ${data.bank_details.bank_name ? `
                          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="color: #64748b; font-weight: 500;">Bank:</span>
                            <span style="color: #1e293b; font-weight: 600;">${data.bank_details.bank_name}</span>
                          </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; background-color: #fef3c7; margin: 10px -20px -20px -20px; padding-left: 20px; padding-right: 20px; border-radius: 0 0 8px 8px;">
                          <span style="color: #92400e; font-weight: 600;">Reference:</span>
                          <span style="color: #92400e; font-weight: bold; font-family: monospace;">${data.invoice_number}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ` : ''}
                
                ${data.payment_method === 'paypal' && data.paypal_email ? `
                  <div style="background: linear-gradient(135deg, #0070ba, #003087); border-radius: 12px; padding: 25px; margin: 15px 0; color: white;">
                    <h4 style="margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center;">
                      💵 PayPal Payment
                    </h4>
                    <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 20px;">
                      <p style="margin: 0 0 10px 0; opacity: 0.9;">Send payment to:</p>
                      <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">${data.paypal_email}</p>
                      <p style="margin: 0; opacity: 0.8; font-size: 14px;">Please include invoice number <strong>${data.invoice_number}</strong> in the payment note.</p>
                    </div>
                  </div>
                ` : ''}
                
                ${data.payment_method === 'stripe' ? `
                  <div style="background: linear-gradient(135deg, #635bff, #4c46c7); border-radius: 12px; padding: 25px; margin: 15px 0; color: white; text-align: center;">
                    <h4 style="margin: 0 0 15px 0; font-size: 16px;">
                      🔒 Secure Online Payment
                    </h4>
                    ${data.stripe_payment_link ? `
                      <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 20px;">
                        <p style="margin: 0 0 20px 0; opacity: 0.9;">Click the button below to pay securely online:</p>
                        <a href="${data.stripe_payment_link}" style="background-color: white; color: #635bff; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                          💳 Pay £${data.total_amount.toFixed(2)} Now
                        </a>
                        <p style="margin: 15px 0 0 0; opacity: 0.7; font-size: 12px;">Powered by Stripe - Your payment is secure and encrypted</p>
                      </div>
                    ` : `
                      <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; opacity: 0.9;">A secure payment link will be sent to you separately for online card payment.</p>
                      </div>
                    `}
                  </div>
                ` : ''}
              </div>
              
              <!-- Contact Information -->
              <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="color: #0369a1; margin: 0 0 5px 0; font-weight: 500;">Questions about this invoice?</p>
                <p style="color: #0369a1; margin: 0; font-size: 14px;">Please contact us - we're here to help!</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #1e293b; color: white; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Best regards,</p>
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold;">Cravings Delight Team</p>
              <div style="border-top: 1px solid #475569; padding-top: 20px;">
                <p style="margin: 0; opacity: 0.7; font-size: 12px;">Premium Catering Services | cravingsdelight.co.uk</p>
              </div>
            </div>
            
          </div>
        </body>
        </html>
      `;

      const adminHtml = `
        <h2>Invoice Sent - ${data.invoice_number}</h2>
        <p>An invoice has been sent to ${data.customer_name} (${data.customer_email})</p>
        <p><strong>Total Amount:</strong> £${data.total_amount.toFixed(2)}</p>
        <p><strong>Event:</strong> ${data.event_location} on ${data.event_date ? new Date(data.event_date).toLocaleDateString() : 'TBD'}</p>
      `;

      emails = [
        { to: data.customer_email, subject: `Invoice ${data.invoice_number} - Cravings Delight`, html: customerHtml }
      ];
    }

    if (type === 'status_update') {
      const statusMessages = {
        pending: 'We have received your catering request and it is currently being reviewed.',
        processing: 'Great news! Your catering order is now being prepared by our kitchen team.',
        on_the_way: 'Your catering order is on the way! Our delivery team is heading to your location.',
        delivered: 'Your catering order has been successfully delivered. We hope you enjoy your event!',
        cancelled: 'Unfortunately, your catering request has been cancelled. Please contact us for more information.'
      };
      
      const statusTitles = {
        pending: 'Order Received',
        processing: 'Order Being Prepared',
        on_the_way: 'Order On The Way',
        delivered: 'Order Delivered',
        cancelled: 'Order Cancelled'
      };
      
      const statusColors = {
        pending: '#f59e0b',
        processing: '#3b82f6', 
        on_the_way: '#8b5cf6',
        delivered: '#10b981',
        cancelled: '#ef4444'
      };
      
      const customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${statusTitles[data.status]} - Cravings Delight</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">CRAVINGS DELIGHT</h1>
              <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 14px;">Premium Catering Services</p>
            </div>
            
            <!-- Status Badge -->
            <div style="text-align: center; margin: -20px 0 0 0;">
              <div style="display: inline-block; background-color: ${statusColors[data.status]}; color: white; padding: 12px 24px; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                ${statusTitles[data.status]}
              </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px;">Dear ${data.customer_name},</h2>
              
              <div style="background-color: #f7fafc; border-left: 4px solid ${statusColors[data.status]}; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #2d3748; margin: 0; font-size: 16px; line-height: 1.6;">${statusMessages[data.status]}</p>
              </div>
              
              <!-- Event Details Card -->
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                  <span style="background-color: ${statusColors[data.status]}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 10px;"></span>
                  Event Details
                </h3>
                <div style="display: grid; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                    <span style="color: #64748b; font-weight: 500;">Location:</span>
                    <span style="color: #1e293b; font-weight: 600;">${data.event_location}</span>
                  </div>
                  ${data.event_date ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #64748b; font-weight: 500;">Date:</span>
                      <span style="color: #1e293b; font-weight: 600;">${new Date(data.event_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              ${data.status === 'delivered' ? `
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
                  <h3 style="margin: 0 0 10px 0; font-size: 20px;">🎉 Thank You!</h3>
                  <p style="margin: 0; opacity: 0.9; line-height: 1.6;">Thank you for choosing Cravings Delight for your catering needs. We hope your event was a success!</p>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">We would love to hear your feedback about our service.</p>
                </div>
              ` : data.status === 'cancelled' ? `
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #dc2626; margin: 0; font-weight: 500;">If you have any questions about this cancellation, please don't hesitate to contact us.</p>
                </div>
              ` : `
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #1d4ed8; margin: 0; font-weight: 500;">📱 We'll keep you updated as your order progresses.</p>
                </div>
              `}
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Best regards,</p>
              <p style="color: #1e293b; margin: 0; font-size: 18px; font-weight: bold;">Cravings Delight Team</p>
              <div style="margin: 20px 0 0 0; padding: 15px 0; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0; font-size: 12px;">Premium Catering Services | cravingsdelight.co.uk</p>
              </div>
            </div>
            
          </div>
        </body>
        </html>
      `;

      emails = [
        { to: data.customer_email, subject: `${statusTitles[data.status]} - Cravings Delight`, html: customerHtml }
      ];
    }

    // Send all emails
    const results = await Promise.all(
      emails.map(async (email) => {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Cravings Delight <noreply@cravingsdelight.co.uk>',
            to: [email.to],
            subject: email.subject,
            html: email.html,
          }),
        });

        if (!response.ok) {
          throw new Error(`Email failed: ${response.statusText}`);
        }

        return await response.json();
      })
    );

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
}