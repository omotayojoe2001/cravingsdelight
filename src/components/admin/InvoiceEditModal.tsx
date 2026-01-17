import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Plus, Trash2 } from 'lucide-react';
import { sendOrderConfirmation } from '@/lib/email';
import { sendInvoiceEmail } from '@/lib/email';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items?: InvoiceItem[];
  invoice_items?: any[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  due_date: string;
  notes: string;
}

interface InvoiceEditModalProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function InvoiceEditModal({ invoice, open, onClose, onSave }: InvoiceEditModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    due_date: '',
    notes: '',
    tax_amount: 0
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (invoice) {
        console.log('Loading invoice for edit:', invoice);
        setFormData({
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          customer_phone: invoice.customer_phone || '',
          customer_address: '',
          due_date: invoice.due_date || '',
          notes: invoice.notes || '',
          tax_amount: invoice.tax_amount || 0
        });
        setItems(Array.isArray(invoice.items) ? invoice.items : (Array.isArray(invoice.invoice_items) ? invoice.invoice_items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.unit_price,
          total: item.total
        })) : []));
      } else {
        console.log('Creating new invoice');
        // Reset form for new invoice
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          customer_address: '',
          due_date: '',
          notes: '',
          tax_amount: 0
        });
        setItems([]);
      }
    }
  }, [invoice, open]);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + formData.tax_amount;
    return { subtotal, total };
  };

  const handleSave = async () => {
    setSaving(true);
    const { subtotal, total } = calculateTotals();

    if (invoice) {
      // Update existing invoice
      const updateData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        due_date: formData.due_date,
        notes: formData.notes,
        tax_amount: formData.tax_amount,
        invoice_items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.total
        })),
        subtotal: subtotal,
        total_amount: total
      };

      console.log('Updating invoice with data:', updateData);

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoice.id);

      if (error) {
        toast.error('Failed to update invoice');
      } else {
        toast.success('Invoice updated successfully');
        
        // Send clear invoice update notification
        try {
          console.log('🔧 DEBUG: Sending invoice update notification...');
          console.log('🔧 DEBUG: Customer email:', invoice.customer_email);
          
          // Fetch bank transfer details from payment settings
          const { data: bankSettings } = await supabase
            .from('payment_settings')
            .select('settings')
            .eq('method_type', 'bank_transfer')
            .eq('is_active', true)
            .single();
          
          let paymentInfo = '';
          if (bankSettings?.settings) {
            const bank = bankSettings.settings;
            paymentInfo = `<br/><br/><strong>PAYMENT DETAILS:</strong><br/>Account Name: ${bank.account_name || 'Cravings Delight Ltd'}<br/>Account Number: ${bank.account_number || 'Not configured'}<br/>Sort Code: ${bank.sort_code || 'Not configured'}<br/>Bank Name: ${bank.bank_name || 'Not configured'}`;
            if (bank.iban) paymentInfo += `<br/>IBAN: ${bank.iban}`;
            paymentInfo += '<br/><br/>Please use the above details for bank transfer payment.';
          }
          
          // Send using order template but with invoice update content
          await sendOrderConfirmation(invoice.customer_email, {
            customer_name: invoice.customer_name,
            items: items.map(item => ({
              name: `${item.name} (UPDATED)`,
              quantity: item.quantity,
              price: (item.price * item.quantity).toFixed(2)
            })),
            total: total.toFixed(2),
            delivery_address: `INVOICE UPDATE - Your invoice ${invoice.invoice_number} has been updated with new pricing. Please review the updated items above.${paymentInfo}`,
            phone: invoice.customer_phone || '',
            invoice_number: invoice.invoice_number
          });
          
          console.log('✅ DEBUG: Invoice update email sent successfully');
          toast.success('Customer notified of invoice update');
          
        } catch (emailError) {
          console.error('❌ DEBUG: Email send failed:', emailError);
          console.error('❌ DEBUG: Error details:', emailError.message);
          toast.error('Failed to notify customer');
        }
        
        onSave();
        onClose();
      }
    } else {
      // Create new invoice
      const invoiceNumber = `INV-${Date.now()}`;
      const createData = {
        invoice_number: invoiceNumber,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        due_date: formData.due_date,
        notes: formData.notes,
        tax_amount: formData.tax_amount,
        invoice_items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.total
        })),
        subtotal: subtotal,
        total_amount: total,
        status: 'draft'
      };

      console.log('Creating invoice with data:', createData);

      const { error } = await supabase
        .from('invoices')
        .insert([createData]);

      if (error) {
        console.error('Invoice creation error:', error);
        toast.error('Failed to create invoice');
      } else {
        toast.success('Invoice created successfully');
        onSave();
        onClose();
      }
    }
    setSaving(false);
  };

  const { subtotal, total } = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? `Edit Invoice ${invoice.invoice_number}` : 'Create New Invoice'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Details</h3>
            
            <div>
              <Label>Customer Name</Label>
              <Input
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              />
            </div>

            <div>
              <Label>Address</Label>
              <Textarea
                value={formData.customer_address}
                onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Invoice Details</h3>
            
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div>
              <Label>Tax Amount (£)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.tax_amount}
                onChange={(e) => setFormData({ ...formData, tax_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Totals */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>£{formData.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Invoice Items</h3>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <Label className="text-xs">Item Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Total</Label>
                  <Input value={`£${item.total.toFixed(2)}`} disabled />
                </div>
                <div className="col-span-1">
                  <Button
                    onClick={() => removeItem(index)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : (invoice ? 'Save Changes' : 'Create Invoice')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}