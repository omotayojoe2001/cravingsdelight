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
import { Search, Filter, Eye } from 'lucide-react';

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
          <div className="text-lg font-bold">
            Total: £{filteredOrders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const orderDate = new Date(order.created_at);
                  const orderItems = order.order_items ? JSON.parse(order.order_items) : [];
                  return (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                      <TableCell className="font-mono">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          {order.allergies && (
                            <div className="text-red-600 text-xs">⚠️ Allergies</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{order.customer_email}</div>
                          <div className="text-muted-foreground">{order.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs">
                          <div>{order.delivery_address}</div>
                          <div className="text-muted-foreground">{order.delivery_city}, {order.delivery_postcode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{orderItems.length} items</div>
                          <div className="text-muted-foreground">
                            {orderItems.slice(0, 2).map((item: any) => item.name).join(', ')}
                            {orderItems.length > 2 && '...'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-bold">£{order.total_amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            Sub: £{order.subtotal_amount?.toFixed(2) || '0.00'} + Del: £{order.delivery_fee?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.order_status === 'delivered' ? 'default' : 'secondary'}>
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{orderDate.toLocaleDateString('en-GB')}</div>
                          <div className="text-muted-foreground">{orderDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Select onValueChange={(val) => updateStatus(order.id, val)}>
                            <SelectTrigger className="w-24 h-8">
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