import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { InvoiceEditModal } from '@/components/admin/InvoiceEditModal';
import { InvoiceStatusHistory } from '@/components/admin/InvoiceStatusHistory';
import { sendOrderConfirmation } from '@/lib/email';
import { toast } from 'sonner';
import { Plus, Search, Edit, Mail, Eye, FileText, Trash2 } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'draft' | 'in_progress' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  created_at: string;
  sent_at: string | null;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyInvoiceId, setHistoryInvoiceId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, statusFilter]);

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  }

  function filterInvoices() {
    let filtered = [...invoices];

    if (searchQuery) {
      filtered = filtered.filter(inv => 
        inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }

  async function updateInvoiceStatus(invoiceId: string, oldStatus: string, newStatus: string, notes: string) {
    const updates: any = { status: newStatus };
    
    if (newStatus === 'sent' && oldStatus !== 'sent') {
      updates.sent_at = new Date().toISOString();
    }
    if (newStatus === 'paid' && oldStatus !== 'paid') {
      updates.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId);

    if (error) {
      toast.error('Failed to update status');
      return false;
    }

    // Add to status history
    await supabase.from('invoice_status_history').insert({
      invoice_id: invoiceId,
      old_status: oldStatus,
      new_status: newStatus,
      notes: notes || null,
      changed_by: 'Admin'
    });

    // Send email notification
    await sendStatusEmail(invoiceId, newStatus);
    
    toast.success(`Invoice status updated to ${newStatus}`);
    fetchInvoices();
    return true;
  }

  async function sendStatusEmail(invoiceId: string, status: string) {
    try {
      console.log('🔧 DEBUG: Attempting to send status update email...');
      console.log('🔧 DEBUG: Invoice ID:', invoiceId);
      console.log('🔧 DEBUG: New status:', status);
      
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        console.log('🔧 DEBUG: Found invoice:', invoice.invoice_number);
        console.log('🔧 DEBUG: Customer email:', invoice.customer_email);
        
        // Use order template for status updates too
        await sendOrderConfirmation(invoice.customer_email, {
          customer_name: invoice.customer_name,
          items: [{
            name: `Invoice ${invoice.invoice_number} Status Update`,
            quantity: 1,
            price: invoice.total_amount.toFixed(2)
          }],
          total: invoice.total_amount.toFixed(2),
          delivery_address: `STATUS UPDATE - Your invoice ${invoice.invoice_number} status has been changed to: ${getStatusLabel(status)}`,
          phone: invoice.customer_phone || ''
        });
        
        console.log('✅ DEBUG: Status update email sent successfully');
        toast.success('Email notification sent');
      } else {
        console.error('❌ DEBUG: Invoice not found for ID:', invoiceId);
        toast.error('Invoice not found');
      }
    } catch (error) {
      console.error('❌ DEBUG: Email send failed:', error);
      console.error('❌ DEBUG: Error message:', error.message);
      console.error('❌ DEBUG: Full error object:', error);
      toast.error('Failed to send email notification');
    }
  }

  const handleStatusChange = async () => {
    if (!editingInvoice || !newStatus) return;
    
    if (!confirm(`Are you sure you want to change invoice ${editingInvoice.invoice_number} status from "${getStatusLabel(editingInvoice.status)}" to "${getStatusLabel(newStatus)}"?\n\nThis will send an email notification to the customer.`)) {
      return;
    }
    
    const success = await updateInvoiceStatus(
      editingInvoice.id, 
      editingInvoice.status, 
      newStatus as any, 
      statusNotes
    );
    
    if (success) {
      setStatusModalOpen(false);
      setEditingInvoice(null);
      setNewStatus('');
      setStatusNotes('');
    }
  };

  async function deleteInvoice(invoiceId: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId);

    if (error) {
      toast.error('Failed to delete invoice');
      return false;
    }

    toast.success('Invoice deleted successfully');
    fetchInvoices();
    return true;
  }

  const handleDelete = async () => {
    if (!deletingInvoice) return;
    
    if (!confirm(`Are you sure you want to permanently delete invoice ${deletingInvoice.invoice_number} for ${deletingInvoice.customer_name}?\n\nThis action cannot be undone and will remove all invoice data and history.`)) {
      return;
    }
    
    const success = await deleteInvoice(deletingInvoice.id);
    
    if (success) {
      setDeleteModalOpen(false);
      setDeletingInvoice(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-blue-100 text-blue-800'; // Order Received
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'; // Order In Progress
      case 'sent': return 'bg-purple-100 text-purple-800'; // Order Sent
      case 'paid': return 'bg-green-100 text-green-800'; // Order Delivered
      case 'cancelled': return 'bg-red-100 text-red-800'; // Order Cancelled
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Order Received';
      case 'in_progress': return 'Order In Progress';
      case 'sent': return 'Order Sent';
      case 'paid': return 'Order Delivered';
      case 'cancelled': return 'Order Cancelled';
      default: return status;
    }
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">{filteredInvoices.length} invoices</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Order Received</SelectItem>
              <SelectItem value="in_progress">Order In Progress</SelectItem>
              <SelectItem value="sent">Order Sent</SelectItem>
              <SelectItem value="paid">Order Delivered</SelectItem>
              <SelectItem value="cancelled">Order Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{invoices.filter(i => i.status === 'sent').length}</div>
              <div className="text-xs text-muted-foreground">Sent</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</div>
              <div className="text-xs text-muted-foreground">Paid</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">£{invoice.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setHistoryInvoiceId(invoice.id);
                          setHistoryModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingInvoice(invoice);
                          setEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingInvoice(invoice);
                          setNewStatus(invoice.status);
                          setStatusModalOpen(true);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setDeletingInvoice(invoice);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Change Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Invoice Status</DialogTitle>
          </DialogHeader>
          
          {editingInvoice && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice: {editingInvoice.invoice_number}</p>
                <p className="font-medium">{editingInvoice.customer_name}</p>
              </div>
              
              <div>
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Order Received</SelectItem>
                    <SelectItem value="in_progress">Order In Progress</SelectItem>
                    <SelectItem value="sent">Order Sent</SelectItem>
                    <SelectItem value="paid">Order Delivered</SelectItem>
                    <SelectItem value="cancelled">Order Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notes (optional)</Label>
                <Textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add notes about this status change..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStatusModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleStatusChange} className="flex-1">
                  Update & Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Edit Modal */}
      <InvoiceEditModal
        invoice={editingInvoice}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingInvoice(null);
        }}
        onSave={fetchInvoices}
      />

      {/* Invoice Create Modal */}
      <InvoiceEditModal
        invoice={null}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={fetchInvoices}
      />

      {/* Status History Modal */}
      <InvoiceStatusHistory
        invoiceId={historyInvoiceId}
        open={historyModalOpen}
        onClose={() => {
          setHistoryModalOpen(false);
          setHistoryInvoiceId(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
          </DialogHeader>
          
          {deletingInvoice && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete invoice <strong>{deletingInvoice.invoice_number}</strong> for <strong>{deletingInvoice.customer_name}</strong>?
              </p>
              <p className="text-sm text-red-600">
                This action cannot be undone. All invoice data and history will be permanently deleted.
              </p>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="flex-1">
                  Delete Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}