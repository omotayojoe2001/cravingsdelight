import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Filter, Eye, Trash2 } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postcode: string;
  allergies: string;
  subtotal_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  order_status: string;
  order_items: string;
  created_at: string;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchQuery, statusFilter, sortBy]);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  function filterAndSortOrders() {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.order_status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'amount_desc': return b.total_amount - a.total_amount;
        case 'amount_asc': return a.total_amount - b.total_amount;
        default: return 0;
      }
    });

    setFilteredOrders(filtered);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success('Status updated');
      fetchOrders();
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? filteredOrders.map(o => o.id) : []);
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    setSelectedOrders(prev => 
      checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) return;
    if (!confirm(`Delete ${selectedOrders.length} selected orders? This action cannot be undone.`)) return;
    
    setDeleting(true);
    const { error } = await supabase.from('orders').delete().in('id', selectedOrders);
    
    if (error) {
      toast.error('Failed to delete orders');
    } else {
      toast.success(`${selectedOrders.length} orders deleted`);
      setSelectedOrders([]);
      fetchOrders();
    }
    setDeleting(false);
  };

  const handleDeleteSingle = async (orderId: string) => {
    if (!confirm('Delete this order? This action cannot be undone.')) return;
    
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) {
      toast.error('Failed to delete order');
    } else {
      toast.success('Order deleted');
      fetchOrders();
    }
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">{filteredOrders.length} of {orders.length} orders</p>
          </div>
          <div className="flex gap-3">
            {selectedOrders.length > 0 && (
              <Button 
                onClick={handleBulkDelete} 
                variant="destructive" 
                size="sm"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : `Delete ${selectedOrders.length}`}
              </Button>
            )}
            <div className="text-lg font-bold">
              Total: £{filteredOrders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="amount_desc">Highest Amount</SelectItem>
                <SelectItem value="amount_asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {orders.filter(o => o.order_status === 'delivered').length}
                </div>
                <div className="text-xs text-muted-foreground">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {orders.filter(o => o.order_status === 'processing').length}
                </div>
                <div className="text-xs text-muted-foreground">Processing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table - Google Sheets Style */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-32">Customer</TableHead>
                <TableHead className="w-28">Contact</TableHead>
                <TableHead className="w-36">Address</TableHead>
                <TableHead className="w-20">Items</TableHead>
                <TableHead className="w-24">Amount</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24">Date</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const orderDate = new Date(order.created_at);
                  const orderItems = order.order_items ? JSON.parse(order.order_items) : [];
                  return (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50 py-2" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                      <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs py-2">#{order.id.slice(0, 6)}</TableCell>
                      <TableCell className="py-2">
                        <div>
                          <div className="font-medium text-sm">{order.customer_name}</div>
                          {order.allergies && (
                            <div className="text-red-600 text-xs">⚠️ Allergies</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="text-xs">
                          <div className="truncate max-w-24">{order.customer_email.split('@')[0]}</div>
                          <div className="text-muted-foreground">{order.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="text-xs max-w-32">
                          <div className="truncate">{order.delivery_address}</div>
                          <div className="text-muted-foreground truncate">{order.delivery_postcode}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="text-xs">
                          <div className="font-medium">{orderItems.length} items</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div>
                          <div className="font-bold text-sm">£{order.total_amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            +£{order.delivery_fee?.toFixed(2) || '0.00'} del
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant={order.order_status === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="text-xs">
                          <div>{orderDate.toLocaleDateString('en-GB')}</div>
                          <div className="text-muted-foreground">{orderDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/orders/${order.id}`)} className="h-7 w-7 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSingle(order.id)} className="h-7 w-7 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Select onValueChange={(val) => updateStatus(order.id, val)}>
                            <SelectTrigger className="w-20 h-7 text-xs">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}