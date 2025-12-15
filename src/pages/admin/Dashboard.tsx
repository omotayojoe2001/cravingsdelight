import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/components/admin/AdminLayout';

interface RecentOrder {
  id: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingCatering: 0,
    pendingReviews: 0,
    todayViews: 0,
    weekOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [dateFilter, setDateFilter] = useState('7');

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, [dateFilter]);

  async function fetchStats() {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateFilter));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [orders, revenue, catering, reviews, views, weekOrders] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount'),
      supabase.from('catering_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('viewed_at', today.toISOString()),
      supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', daysAgo.toISOString())
    ]);

    const totalRev = revenue.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    setStats({
      totalOrders: orders.count || 0,
      totalRevenue: totalRev,
      pendingCatering: catering.count || 0,
      pendingReviews: reviews.count || 0,
      todayViews: views.count || 0,
      weekOrders: weekOrders.count || 0
    });
  }

  async function fetchRecentOrders() {
    const { data } = await supabase
      .from('orders')
      .select('id, customer_name, total_amount, order_status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setRecentOrders(data);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Table - Google Sheets Style */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">Key Metrics</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total Revenue</TableCell>
                <TableCell className="font-bold text-green-600">£{stats.totalRevenue.toFixed(2)}</TableCell>
                <TableCell>All time</TableCell>
                <TableCell><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Orders</TableCell>
                <TableCell className="font-bold text-blue-600">{stats.totalOrders}</TableCell>
                <TableCell>{stats.weekOrders} in selected period</TableCell>
                <TableCell><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Tracking</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Today's Views</TableCell>
                <TableCell className="font-bold text-purple-600">{stats.todayViews}</TableCell>
                <TableCell>Today</TableCell>
                <TableCell><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Live</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pending Catering</TableCell>
                <TableCell className="font-bold text-orange-600">{stats.pendingCatering}</TableCell>
                <TableCell>Current</TableCell>
                <TableCell><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Pending</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pending Reviews</TableCell>
                <TableCell className="font-bold text-yellow-600">{stats.pendingReviews}</TableCell>
                <TableCell>Current</TableCell>
                <TableCell><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Review</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Recent Orders Table - Google Sheets Style */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const orderDate = new Date(order.created_at);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{order.customer_name}</TableCell>
                      <TableCell className="font-bold">£{order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.order_status}
                        </span>
                      </TableCell>
                      <TableCell>{orderDate.toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>{orderDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}