import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Filter } from 'lucide-react';

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
  status: string;
  submitted_at: string;
  product_id?: string;
  product_name?: string;
  selected_products?: string;
  total_estimated_guests?: number;
  event_type?: string;
  budget_range?: string;
  additional_services?: string;
}

export default function Catering() {
  const [requests, setRequests] = useState<CateringRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CateringRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter, searchQuery]);

  async function fetchRequests() {
    const { data } = await supabase
      .from('catering_requests')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (data) setRequests(data);
  }

  function filterRequests() {
    let filtered = [...requests];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(req => 
        req.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requester_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.event_location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRequests(filtered);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('catering_requests').update({ status }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success('Status updated');
      fetchRequests();
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Catering Requests</h1>
            <p className="text-muted-foreground">{filteredRequests.length} of {requests.length} requests</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {requests.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="text-xs text-muted-foreground">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or location..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Catering Requests Table - Google Sheets Style */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Event Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Items/Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No catering requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => {
                  const selectedProducts = req.selected_products ? JSON.parse(req.selected_products) : [];
                  return (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono">#{req.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{req.requester_name}</div>
                          {req.event_type && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {req.event_type}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{req.requester_email}</div>
                          <div className="text-muted-foreground">{req.requester_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {req.event_date ? new Date(req.event_date).toLocaleDateString('en-GB') : 'TBD'}
                          </div>
                          {req.event_time && (
                            <div className="text-muted-foreground">{req.event_time}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate">{req.event_location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{req.total_estimated_guests || req.number_of_guests}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {selectedProducts.length > 0 ? (
                            <div>
                              <div className="font-medium">{selectedProducts.length} items</div>
                              <div className="text-muted-foreground">
                                {selectedProducts.slice(0, 2).map((item: any) => item.name).join(', ')}
                                {selectedProducts.length > 2 && '...'}
                              </div>
                            </div>
                          ) : req.product_name ? (
                            <Badge variant="outline">{req.product_name}</Badge>
                          ) : (
                            <div>
                              {req.budget_range && (
                                <div className="text-muted-foreground">{req.budget_range}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          req.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          req.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          req.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(req.submitted_at).toLocaleDateString('en-GB')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={req.status} onValueChange={(val) => updateStatus(req.id, val)}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
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