export async function sendInvoiceEmail(invoiceId: string, status: string, message?: string) {
  // For now, just log the email attempt since Resend requires server-side setup
  console.log('Email would be sent:', {
    invoiceId,
    status,
    message,
    note: 'Email service requires backend API setup'
  });
  
  // Simulate successful email send
  return { success: true, emailId: 'simulated-' + Date.now() };
}