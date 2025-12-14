import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  size_selected: string | null;
  spice_level: string | null;
  customization_note: string | null;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postcode: string;
  delivery_country: string;
  delivery_notes: string | null;
  allergies: string | null;
  subtotal_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  order_items: string;
  payment_intent_id: string;
  created_at: string;
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  async function fetchOrderDetails() {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      toast.error('Failed to load order');
      navigate('/admin/orders');
      return;
    }

    // Parse order items from JSON
    let parsedItems = [];
    if (orderData?.order_items) {
      try {
        parsedItems = JSON.parse(orderData.order_items);
      } catch (e) {
        console.error('Failed to parse order items:', e);
      }
    }

    setOrder(orderData);
    setItems(parsedItems);
    setLoading(false);
  }

  async function updateStatus(status: string) {
    const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success('Status updated');
      fetchOrderDetails();
    }
  }

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;
  if (!order) return <AdminLayout><p>Order not found</p></AdminLayout>;

  const orderDate = new Date(order.created_at);

  return (
    <AdminLayout>
      <Button variant="ghost" onClick={() => navigate('/admin/orders')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground mt-1">Order ID: {order.id}</p>
        </div>
        <Select value={order.order_status} onValueChange={updateStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-display text-xl font-bold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">
                    {order.delivery_address}<br/>
                    {order.delivery_city}, {order.delivery_postcode}<br/>
                    {order.delivery_country}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t space-y-3">
              {order.delivery_notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery Notes</p>
                  <p className="text-sm italic">{order.delivery_notes}</p>
                </div>
              )}
              {order.allergies && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">⚠️ Allergies & Dietary Requirements</p>
                  <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded">{order.allergies}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Intent ID</p>
                <p className="text-xs font-mono bg-gray-100 p-1 rounded">{order.payment_intent_id}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-lg">{item.name}</p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>Quantity: <span className="font-medium text-foreground">{item.quantity}</span></p>
                      <p>Spice Level: <span className="font-medium text-foreground">{item.spiceLevel}</span></p>
                      {item.customizationNote && (
                        <p className="italic">Special Request: <span className="font-medium text-foreground">"{item.customizationNote}"</span></p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg">£{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-medium">{orderDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Order Time</p>
                  <p className="font-medium">{orderDate.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={order.order_status === 'delivered' ? 'default' : 'secondary'}>
                  {order.order_status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                  {order.payment_status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-display text-xl font-bold mb-4">Total</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>£{order.subtotal_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>£{order.delivery_fee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold text-golden">£{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
