import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
}

export default function Catering() {
  const [requests, setRequests] = useState<CateringRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    let query = supabase.from('catering_requests').select('*').order('submitted_at', { ascending: false });
    
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    
    const { data } = await query;
    if (data) setRequests(data);
  }

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

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
      <div className="h-full max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Catering Requests</h1>
            <p className="text-sm text-muted-foreground">{requests.length} requests</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests Grid */}
        <div className="flex-1 overflow-hidden">
          {requests.length === 0 ? (
            <div className="bg-card rounded-lg border p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No catering requests yet</h3>
              <p className="text-muted-foreground">Catering requests will appear here once submitted</p>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-sm">{req.requester_name}</h3>
                        <p className="text-xs text-muted-foreground">{req.requester_email}</p>
                      </div>
                      <Badge variant={req.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                        {req.status}
                      </Badge>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Guests:</span>
                        <span className="font-medium">{req.number_of_guests}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {req.event_date ? new Date(req.event_date).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                      
                      {req.event_time && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{req.event_time}</span>
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium text-xs mt-1 line-clamp-2">{req.event_location}</p>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium text-xs mt-1">{req.requester_phone}</p>
                      </div>
                      
                      {req.requirements && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Requirements:</span>
                          <p className="text-xs mt-1 line-clamp-2">{req.requirements}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <Select value={req.status} onValueChange={(val) => updateStatus(req.id, val)}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
