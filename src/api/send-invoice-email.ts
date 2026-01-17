import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { invoiceId, status } = await request.json();

    // Get invoice details
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error || !invoice) {
      return Response.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const statusMessages = {
      draft: 'Your invoice has been created and is being prepared.',
      sent: 'Your invoice has been sent and is ready for payment.',
      paid: 'Thank you! Your payment has been received and processed.',
      overdue: 'Your invoice is now overdue. Please make payment as soon as possible.',
      cancelled: 'Your invoice has been cancelled.'
    };

    const subject = `Invoice ${invoice.invoice_number} - Status Update: ${status.toUpperCase()}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B0000; color: white; padding: 20px; text-align: center;">
          <h1>Cravings Delight</h1>
          <p>Invoice Status Update</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${invoice.customer_name},</h2>
          
          <p>Your invoice status has been updated:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Invoice Number:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${invoice.invoice_number}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: uppercase; font-weight: bold; color: ${status === 'paid' ? '#16a34a' : status === 'overdue' ? '#dc2626' : '#2563eb'};">${status}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">$${invoice.total_amount.toFixed(2)}</td>
              </tr>
              ${invoice.due_date ? `
              <tr>
                <td style="padding: 10px;"><strong>Due Date:</strong></td>
                <td style="padding: 10px;">${new Date(invoice.due_date).toLocaleDateString()}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <p style="background: #e0f2fe; padding: 15px; border-radius: 5px; border-left: 4px solid #0288d1;">
            ${statusMessages[status as keyof typeof statusMessages]}
          </p>
          
          ${status === 'sent' || status === 'overdue' ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cravingsdelight.com/invoice/${invoice.id}" 
               style="background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Invoice
            </a>
          </div>
          ` : ''}
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          <strong>Cravings Delight Team</strong></p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>Cravings Delight - Authentic African Cuisine</p>
          <p>Hull, United Kingdom</p>
        </div>
      </div>
    `;

    const { data, error: emailError } = await resend.emails.send({
      from: 'Cravings Delight <invoices@cravingsdelight.com>',
      to: [invoice.customer_email],
      subject: subject,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}