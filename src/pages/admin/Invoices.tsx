import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Filter, Eye, FileText, CheckCircle, Trash2 } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  event_date: string | null;
  event_location: string;
  number_of_guests: number;
  invoice_items: any[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  due_date: string | null;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  notes: string;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, statusFilter, searchQuery]);

  async function fetchInvoices() {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setInvoices(data);
  }

  function filterInvoices() {
    let filtered = [...invoices];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(inv => 
        inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredInvoices(filtered);
  }

  async function markAsPaid(id: string) {
    const { error } = await supabase
      .from('invoices')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update invoice');
    } else {
      toast.success('Invoice marked as paid');
      fetchInvoices();
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedInvoices(checked ? filteredInvoices.map(inv => inv.id) : []);
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    setSelectedInvoices(prev => 
      checked ? [...prev, invoiceId] : prev.filter(id => id !== invoiceId)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedInvoices.length === 0) return;
    if (!confirm(`Delete ${selectedInvoices.length} selected invoices? This action cannot be undone.`)) return;
    
    setDeleting(true);
    const { error } = await supabase.from('invoices').delete().in('id', selectedInvoices);
    
    if (error) {
      toast.error('Failed to delete invoices');
    } else {
      toast.success(`${selectedInvoices.length} invoices deleted`);
      setSelectedInvoices([]);
      fetchInvoices();
    }
    setDeleting(false);
  };

  const handleDeleteSingle = async (invoiceId: string) => {
    if (!confirm('Delete this invoice? This action cannot be undone.')) return;
    
    const { error } = await supabase.from('invoices').delete().eq('id', invoiceId);
    if (error) {
      toast.error('Failed to delete invoice');
    } else {
      toast.success('Invoice deleted');
      fetchInvoices();
    }
  };

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total_amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total_amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">{filteredInvoices.length} of {invoices.length} invoices</p>
          </div>
          
          <div className="flex gap-4">
            {selectedInvoices.length > 0 && (
              <Button 
                onClick={handleBulkDelete} 
                variant="destructive" 
                size="sm"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : `Delete ${selectedInvoices.length}`}
              </Button>
            )}
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  £{totalRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Paid</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  £{pendingAmount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, email, or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{invoice.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{invoice.customer_email}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div className="font-medium">
                            {invoice.event_date ? new Date(invoice.event_date).toLocaleDateString('en-GB') : 'TBD'}
                          </div>
                          <div className="text-muted-foreground max-w-xs truncate">
                            {invoice.event_location}
                          </div>
                          <div className="text-muted-foreground">
                            {invoice.number_of_guests} guests
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-bold">£{invoice.total_amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.invoice_items.length} items
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="text-muted-foreground">Created:</span><br/>
                            {new Date(invoice.created_at).toLocaleDateString('en-GB')}
                          </div>
                          {invoice.due_date && (
                            <div>
                              <span className="text-muted-foreground">Due:</span><br/>
                              {new Date(invoice.due_date).toLocaleDateString('en-GB')}
                            </div>
                          )}
                          {invoice.paid_at && (
                            <div>
                              <span className="text-muted-foreground">Paid:</span><br/>
                              {new Date(invoice.paid_at).toLocaleDateString('en-GB')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsModalOpen(true);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {invoice.status === 'sent' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsPaid(invoice.id)}
                              className="h-7 w-7 p-0"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSingle(invoice.id)}
                            className="h-7 w-7 p-0"
                            title="Delete Invoice"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Invoice Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Details - {selectedInvoice?.invoice_number}</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedInvoice.customer_name}</div>
                        <div><strong>Email:</strong> {selectedInvoice.customer_email}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Event Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Date:</strong> {selectedInvoice.event_date ? new Date(selectedInvoice.event_date).toLocaleDateString('en-GB') : 'TBD'}</div>
                        <div><strong>Location:</strong> {selectedInvoice.event_location}</div>
                        <div><strong>Guests:</strong> {selectedInvoice.number_of_guests}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Financial Summary</h3>
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>£{selectedInvoice.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax ({selectedInvoice.tax_rate}%):</span>
                          <span>£{selectedInvoice.tax_amount.toFixed(2)}</span>
                        </div>
                        {selectedInvoice.delivery_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span>£{selectedInvoice.delivery_fee.toFixed(2)}</span>
                          </div>
                        )}
                        {selectedInvoice.discount_amount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>-£{selectedInvoice.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>£{selectedInvoice.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Invoice Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.invoice_items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>£{item.unit_price.toFixed(2)}</TableCell>
                            <TableCell>£{item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {selectedInvoice.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <div className="bg-muted/50 p-3 rounded text-sm">
                      {selectedInvoice.notes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}