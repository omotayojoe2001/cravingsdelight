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
  delivery_country: string;
  delivery_notes: string;
  allergies: string;
  subtotal_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  order_status: string;
  order_items: string;
  payment_intent_id: string;
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
    console.log('Fetching orders...');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ FETCH ORDERS ERROR:', error);
    } else {
      console.log('✅ ORDERS FETCHED:', data?.length || 0, 'orders');
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
      <div className="h-full max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <div className="text-sm text-muted-foreground">
            {filteredOrders.length} orders
          </div>
        </div>

        {/* Filters - Compact */}
        <div className="bg-card rounded-lg border p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
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
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest</SelectItem>
                <SelectItem value="date_asc">Oldest</SelectItem>
                <SelectItem value="amount_desc">High Amount</SelectItem>
                <SelectItem value="amount_asc">Low Amount</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-xs text-muted-foreground flex items-center">
              Total: £{filteredOrders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Orders Table - Scrollable */}
        <div className="bg-card rounded-lg border flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead className="w-32">Customer</TableHead>
                  <TableHead className="w-40">Contact</TableHead>
                  <TableHead className="w-20">Amount</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const orderDate = new Date(order.created_at);
                    return (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                        <TableCell className="font-mono text-xs">{order.id.slice(0, 6)}</TableCell>
                        <TableCell className="font-medium text-sm">{order.customer_name}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="truncate">{order.customer_email}</div>
                            <div className="text-muted-foreground">{order.customer_phone}</div>
                            {order.allergies && (
                              <div className="text-red-600 text-xs mt-1">⚠️ Allergies</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-sm">
                          <div>£{order.total_amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            Sub: £{order.subtotal_amount?.toFixed(2) || '0.00'} + Del: £{order.delivery_fee?.toFixed(2) || '0.00'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.order_status === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                            {order.order_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div>{orderDate.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">{orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/admin/orders/${order.id}`)} className="h-7 px-2">
                              <Eye className="h-3 w-3" />
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
      </div>
    </AdminLayout>
  );
}
