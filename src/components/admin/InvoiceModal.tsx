import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { sendInvoiceEmail } from '@/lib/email';
import { toast } from 'sonner';
import { Plus, Trash2, Send, CreditCard, Building, DollarSign, Settings } from 'lucide-react';

interface InvoiceItem {
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface CateringRequest {
  id: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  event_date: string | null;
  event_time: string | null;
  event_location: string;
  number_of_guests: number;
  requirements: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cateringRequest: CateringRequest | null;
}

export default function InvoiceModal({ isOpen, onClose, cateringRequest }: InvoiceModalProps) {
  const [currentTab, setCurrentTab] = useState('booking');
  const [items, setItems] = useState<InvoiceItem[]>([{ name: '', quantity: 1, unit_price: 0, total: 0 }]);
  const [taxRate, setTaxRate] = useState(20);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('Payment due within 30 days of invoice date.');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentSettings, setPaymentSettings] = useState<any>({});
  const [bankDetails, setBankDetails] = useState({
    account_name: 'Cravings Delight Ltd',
    account_number: '',
    sort_code: '',
    bank_name: '',
    iban: '',
    swift: ''
  });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [stripeOption, setStripeOption] = useState('generate'); // 'generate' or 'manual'
  const [manualPaymentLink, setManualPaymentLink] = useState('');
  const [manualCustomer, setManualCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    event_date: '',
    event_time: '',
    event_location: '',
    number_of_guests: 0
  });

  useEffect(() => {
    if (cateringRequest) {
      loadPaymentSettings();
      parseCustomerBooking();
    }
  }, [cateringRequest]);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount + deliveryFee - discount;

  async function loadPaymentSettings() {
    const { data } = await supabase.from('payment_settings').select('*');
    if (data) {
      const settings = {};
      data.forEach(setting => {
        settings[setting.method_type] = setting.settings;
      });
      setPaymentSettings(settings);
      
      if (settings.bank_transfer) {
        setBankDetails({ ...bankDetails, ...settings.bank_transfer });
      }
      if (settings.paypal?.email) {
        setPaypalEmail(settings.paypal.email);
      }
    }
  }

  function parseCustomerBooking() {
    if (!cateringRequest) return;
    
    const requirements = cateringRequest.requirements || '';
    const lines = requirements.split('\n');
    const selectedItemsStart = lines.findIndex(line => line.includes('Selected Items:'));
    const specialReqStart = lines.findIndex(line => line.includes('Special Requirements:'));
    
    let bookingItems: any[] = [];
    if (selectedItemsStart !== -1) {
      const itemsEnd = specialReqStart !== -1 ? specialReqStart : lines.length;
      bookingItems = lines.slice(selectedItemsStart + 1, itemsEnd)
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const itemText = line.replace('- ', '');
          const parts = itemText.split(' - ');
          return {
            name: parts[0] || itemText,
            details: parts.slice(1).join(' - ') || '',
            quantity: 1,
            unit_price: 0,
            total: 0
          };
        });
    }
    
    setSelectedItems(bookingItems);
    
    // Pre-populate invoice items with booking items
    if (bookingItems.length > 0 && items.length === 1 && !items[0].name) {
      setItems(bookingItems);
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSendInvoice = async () => {
    const customerData = cateringRequest || {
      id: null,
      requester_name: manualCustomer.name,
      requester_email: manualCustomer.email,
      requester_phone: manualCustomer.phone,
      event_date: manualCustomer.event_date,
      event_time: manualCustomer.event_time,
      event_location: manualCustomer.event_location,
      number_of_guests: manualCustomer.number_of_guests
    };
    
    if (!customerData.requester_name || !customerData.requester_email) {
      toast.error('Please fill in customer name and email');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create invoice in database
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          catering_request_id: customerData.id,
          customer_name: customerData.requester_name,
          customer_email: customerData.requester_email,
          customer_phone: customerData.requester_phone,
          event_date: customerData.event_date,
          event_time: customerData.event_time,
          event_location: customerData.event_location,
          number_of_guests: customerData.number_of_guests,
          invoice_items: items,
          subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          delivery_fee: deliveryFee,
          discount_amount: discount,
          total_amount: totalAmount,
          notes,
          terms_conditions: terms,
          due_date: dueDate || null,
          payment_method: paymentMethod,
          bank_details: paymentMethod === 'bank_transfer' ? bankDetails : null,
          paypal_email: paymentMethod === 'paypal' ? paypalEmail : null,
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Handle Stripe payment link
      let stripePaymentLink = null;
      if (paymentMethod === 'stripe') {
        if (stripeOption === 'generate') {
          try {
            const apiUrl = import.meta.env.DEV 
              ? 'https://cravingsdelight.vercel.app/api/create-stripe-link'
              : '/api/create-stripe-link';
              
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                invoice_number: invoice.invoice_number,
                customer_email: customerData.requester_email,
                amount: Math.round(totalAmount * 100), // Convert to cents
                currency: 'gbp',
                description: `Invoice ${invoice.invoice_number} - ${customerData.event_location}`
              })
            });
            
            if (response.ok) {
              const { payment_link } = await response.json();
              stripePaymentLink = payment_link;
            } else {
              throw new Error('Failed to create payment link');
            }
          } catch (error) {
            console.error('Error creating Stripe payment link:', error);
            toast.error('Failed to create Stripe payment link');
          }
        } else {
          // Use manual payment link
          stripePaymentLink = manualPaymentLink;
        }
        
        // Update invoice with payment link
        if (stripePaymentLink) {
          await supabase
            .from('invoices')
            .update({ payment_link: stripePaymentLink })
            .eq('id', invoice.id);
        }
      }

      // Send email to ONLY this customer
      await sendInvoiceEmail(customerData.requester_email, {
        invoice_number: invoice.invoice_number,
        customer_name: customerData.requester_name,
        customer_email: customerData.requester_email, // Ensure single recipient
        event_date: customerData.event_date,
        event_location: customerData.event_location,
        items,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        delivery_fee: deliveryFee,
        discount_amount: discount,
        total_amount: totalAmount,
        due_date: dueDate,
        notes,
        payment_method: paymentMethod,
        bank_details: paymentMethod === 'bank_transfer' ? bankDetails : null,
        paypal_email: paymentMethod === 'paypal' ? paypalEmail : null,
        stripe_payment_link: stripePaymentLink
      });

      toast.success('Invoice sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    } finally {
      setIsLoading(false);
    }
  };

  // Allow modal to open even without catering request for manual invoice creation

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Invoice - {cateringRequest?.requester_name || manualCustomer.name || 'New Customer'}</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="booking">1. {cateringRequest ? 'Review Booking' : 'Customer Details'}</TabsTrigger>
            <TabsTrigger value="invoice">2. Invoice Items</TabsTrigger>
            <TabsTrigger value="payment">3. Payment Method</TabsTrigger>
            <TabsTrigger value="confirm">4. Send Invoice</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {cateringRequest ? 'Customer Booking Details' : 'Customer Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cateringRequest ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div><strong>Customer:</strong> {cateringRequest.requester_name}</div>
                      <div><strong>Email:</strong> {cateringRequest.requester_email}</div>
                      <div><strong>Phone:</strong> {cateringRequest.requester_phone}</div>
                    </div>
                    <div className="space-y-2">
                      <div><strong>Event Date:</strong> {cateringRequest.event_date ? new Date(cateringRequest.event_date).toLocaleDateString() : 'TBD'}</div>
                      <div><strong>Time:</strong> {cateringRequest.event_time || 'TBD'}</div>
                      <div><strong>Location:</strong> {cateringRequest.event_location}</div>
                      <div><strong>Guests:</strong> {cateringRequest.number_of_guests}</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Customer Name</Label>
                      <Input
                        value={manualCustomer.name}
                        onChange={(e) => setManualCustomer({...manualCustomer, name: e.target.value})}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={manualCustomer.email}
                        onChange={(e) => setManualCustomer({...manualCustomer, email: e.target.value})}
                        placeholder="customer@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={manualCustomer.phone}
                        onChange={(e) => setManualCustomer({...manualCustomer, phone: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Date</Label>
                      <Input
                        type="date"
                        value={manualCustomer.event_date}
                        onChange={(e) => setManualCustomer({...manualCustomer, event_date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Time</Label>
                      <Input
                        type="time"
                        value={manualCustomer.event_time}
                        onChange={(e) => setManualCustomer({...manualCustomer, event_time: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Location</Label>
                      <Input
                        value={manualCustomer.event_location}
                        onChange={(e) => setManualCustomer({...manualCustomer, event_location: e.target.value})}
                        placeholder="Event venue/address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Guests</Label>
                      <Input
                        type="number"
                        value={manualCustomer.number_of_guests}
                        onChange={(e) => setManualCustomer({...manualCustomer, number_of_guests: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
                
                {cateringRequest && selectedItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Items Selected by Customer:</h4>
                    <div className="space-y-2">
                      {selectedItems.map((item, idx) => (
                        <div key={idx} className="bg-blue-50 border border-blue-200 p-3 rounded">
                          <div className="font-medium text-blue-800">{item.name}</div>
                          {item.details && (
                            <div className="text-sm text-blue-600">{item.details}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cateringRequest && (() => {
                  const requirements = cateringRequest.requirements || '';
                  const lines = requirements.split('\n');
                  const specialReqStart = lines.findIndex(line => line.includes('Special Requirements:'));
                  let specialRequirements = '';
                  if (specialReqStart !== -1) {
                    const reqLines = lines.slice(specialReqStart + 1)
                      .filter(line => line.trim() !== '' && line.trim() !== 'None')
                      .map(line => line.trim());
                    specialRequirements = reqLines.join('\n').trim();
                  }
                  
                  return specialRequirements && (
                    <div>
                      <h4 className="font-semibold mb-2">Special Requirements & Notes:</h4>
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                        {specialRequirements}
                      </div>
                    </div>
                  );
                })()}
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => setCurrentTab('invoice')}>
                    Next: Invoice Items →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6">

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Invoice Items</h3>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {cateringRequest && selectedItems.length > 0 && (
                <div className="mb-4">
                  <Button
                    onClick={() => {
                      const newItems = selectedItems.map(item => ({
                        name: item.name + (item.details ? ` - ${item.details}` : ''),
                        quantity: 1,
                        unit_price: 0,
                        total: 0
                      }));
                      setItems(newItems);
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Load Customer Selected Items ({selectedItems.length})
                  </Button>
                </div>
              )}
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={`£${item.total.toFixed(2)}`}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      onClick={() => removeItem(index)}
                      size="sm"
                      variant="ghost"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="delivery-fee">Delivery Fee (£)</Label>
                <Input
                  id="delivery-fee"
                  type="number"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (£)</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Invoice Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>£{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>£{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-£{discount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>£{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes for the customer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentTab('booking')}>
              ← Back to Booking
            </Button>
            <Button onClick={() => setCurrentTab('payment')}>
              Next: Payment Method →
            </Button>
          </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Payment Method Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          PayPal
                        </div>
                      </SelectItem>
                      <SelectItem value="stripe">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Stripe Payment Link
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Bank Account Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input
                          id="account-name"
                          value={bankDetails.account_name}
                          onChange={(e) => setBankDetails({...bankDetails, account_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          value={bankDetails.account_number}
                          onChange={(e) => setBankDetails({...bankDetails, account_number: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sort-code">Sort Code</Label>
                        <Input
                          id="sort-code"
                          value={bankDetails.sort_code}
                          onChange={(e) => setBankDetails({...bankDetails, sort_code: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={bankDetails.bank_name}
                          onChange={(e) => setBankDetails({...bankDetails, bank_name: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div>
                    <Label htmlFor="paypal-email">PayPal Business Email</Label>
                    <Input
                      id="paypal-email"
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="business@cravingsdelight.co.uk"
                    />
                  </div>
                )}

                {paymentMethod === 'stripe' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Stripe Payment Link Option</Label>
                      <Select value={stripeOption} onValueChange={setStripeOption}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generate">Generate Payment Link Automatically</SelectItem>
                          <SelectItem value="manual">Add Existing Payment Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {stripeOption === 'generate' ? (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                        <p className="text-sm text-blue-800">
                          A Stripe payment link will be automatically created for £{totalAmount.toFixed(2)} 
                          and included in the customer email.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="manual-payment-link">Payment Link URL</Label>
                        <Input
                          id="manual-payment-link"
                          value={manualPaymentLink}
                          onChange={(e) => setManualPaymentLink(e.target.value)}
                          placeholder="https://buy.stripe.com/..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentTab('invoice')}>
                ← Back to Invoice
              </Button>
              <Button onClick={() => setCurrentTab('confirm')}>
                Next: Confirm & Send →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Confirm & Send Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <h4 className="font-semibold text-yellow-800 mb-2">Review Before Sending</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>• Customer: {cateringRequest?.requester_name || manualCustomer.name} ({cateringRequest?.requester_email || manualCustomer.email})</p>
                    <p>• Invoice Items: {items.filter(item => item.name).length} items</p>
                    <p>• Total Amount: £{totalAmount.toFixed(2)}</p>
                    <p>• Payment Method: {paymentMethod === 'bank_transfer' ? 'Bank Transfer' : paymentMethod === 'paypal' ? 'PayPal' : 'Stripe Payment Link'}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvoice} disabled={isLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending Invoice...' : 'Send Invoice Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}