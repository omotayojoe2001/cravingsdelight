import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Filter, Eye, FileText } from 'lucide-react';
import InvoiceModal from '@/components/admin/InvoiceModal';

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
  const [selectedRequest, setSelectedRequest] = useState<CateringRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceRequest, setInvoiceRequest] = useState<CateringRequest | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

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
    const request = requests.find(r => r.id === id);
    if (!request) return;
    
    const { error } = await supabase.from('catering_requests').update({ status }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
      return;
    }
    
    // Send status update email
    try {
      const { sendStatusUpdateEmail } = await import('@/lib/email');
      await sendStatusUpdateEmail(request.requester_email, {
        customer_name: request.requester_name,
        status,
        event_location: request.event_location,
        event_date: request.event_date
      });
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
    }
    
    toast.success('Status updated and customer notified');
    fetchRequests();
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
                {requests.filter(r => r.status === 'delivered').length}
              </div>
              <div className="text-xs text-muted-foreground">Delivered</div>
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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="on_the_way">On the Way</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Catering Requests Table - Improved Layout */}
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b">
                <TableHead className="font-semibold text-gray-700 py-3 w-16">ID</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 w-48">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 w-32">Contact</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 w-28">Event</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 w-24">Items</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 w-24">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No catering requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => {
                  // Parse the requirements to extract product details
                  const parseRequirements = (requirements: string) => {
                    const lines = requirements.split('\n');
                    const eventTypeMatch = lines.find(line => line.startsWith('Event Type:'));
                    const budgetMatch = lines.find(line => line.startsWith('Budget:'));
                    const selectedItemsStart = lines.findIndex(line => line.includes('Selected Items:'));
                    const specialReqStart = lines.findIndex(line => line.includes('Special Requirements:'));
                    
                    const eventType = eventTypeMatch ? eventTypeMatch.replace('Event Type: ', '') : '';
                    const budget = budgetMatch ? budgetMatch.replace('Budget: ', '') : '';
                    
                    let selectedItems: string[] = [];
                    if (selectedItemsStart !== -1) {
                      const itemsEnd = specialReqStart !== -1 ? specialReqStart : lines.length;
                      selectedItems = lines.slice(selectedItemsStart + 1, itemsEnd)
                        .filter(line => line.trim().startsWith('-'))
                        .map(line => line.replace('- ', ''));
                    }
                    
                    let specialRequirements = '';
                    if (specialReqStart !== -1) {
                      const reqLines = lines.slice(specialReqStart + 1)
                        .filter(line => line.trim() !== '' && line.trim() !== 'None')
                        .map(line => line.trim());
                      specialRequirements = reqLines.join('\n').trim();
                    }
                    
                    return { eventType, budget, selectedItems, specialRequirements };
                  };
                  
                  const parsed = parseRequirements(req.requirements || '');
                  
                  return (
                    <TableRow key={req.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className="font-mono text-xs py-2 px-2">#{req.id.slice(0, 6)}</TableCell>
                      
                      <TableCell className="py-2 px-2">
                        <div className="space-y-1">
                          <div className="font-medium text-sm truncate">{req.requester_name}</div>
                          <div className="text-xs text-muted-foreground truncate">{req.event_location}</div>
                          <div className="text-xs">{req.total_estimated_guests || req.number_of_guests} guests</div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2 px-2">
                        <div className="text-xs space-y-1">
                          <div className="truncate">{req.requester_email.split('@')[0]}</div>
                          <div className="text-muted-foreground">{req.requester_phone}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2 px-2">
                        <div className="text-xs space-y-1">
                          <div className="font-medium">
                            {req.event_date ? new Date(req.event_date).toLocaleDateString('en-GB') : 'TBD'}
                          </div>
                          <div className="text-muted-foreground">{req.event_time || 'TBD'}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2 px-2">
                        <div className="text-xs">
                          {parsed.selectedItems.length > 0 ? (
                            <div className="font-medium">{parsed.selectedItems.length} items</div>
                          ) : req.product_name ? (
                            <div className="font-medium text-blue-800 truncate">{req.product_name}</div>
                          ) : (
                            <div className="text-muted-foreground">None</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2 px-2">
                        <Badge className={
                          req.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          req.status === 'on_the_way' ? 'bg-blue-100 text-blue-800' :
                          req.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {req.status.replace('_', ' ')}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(req.submitted_at).toLocaleDateString('en-GB')}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2 px-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsModalOpen(true);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setInvoiceRequest(req);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="h-7 w-7 p-0"
                            title="Send Invoice"
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Select value={req.status} onValueChange={(val) => updateStatus(req.id, val)}>
                            <SelectTrigger className="w-20 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="on_the_way">On Way</SelectItem>
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

        {/* Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Catering Request Details</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const currentIndex = filteredRequests.findIndex(r => r.id === selectedRequest?.id);
                      if (currentIndex > 0) {
                        setSelectedRequest(filteredRequests[currentIndex - 1]);
                      }
                    }}
                    disabled={!selectedRequest || filteredRequests.findIndex(r => r.id === selectedRequest.id) === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const currentIndex = filteredRequests.findIndex(r => r.id === selectedRequest?.id);
                      if (currentIndex < filteredRequests.length - 1) {
                        setSelectedRequest(filteredRequests[currentIndex + 1]);
                      }
                    }}
                    disabled={!selectedRequest || filteredRequests.findIndex(r => r.id === selectedRequest.id) === filteredRequests.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            {selectedRequest && (() => {
              const parsed = (() => {
                const requirements = selectedRequest.requirements || '';
                const lines = requirements.split('\n');
                const eventTypeMatch = lines.find(line => line.startsWith('Event Type:'));
                const budgetMatch = lines.find(line => line.startsWith('Budget:'));
                const selectedItemsStart = lines.findIndex(line => line.includes('Selected Items:'));
                const specialReqStart = lines.findIndex(line => line.includes('Special Requirements:'));
                
                const eventType = eventTypeMatch ? eventTypeMatch.replace('Event Type: ', '') : '';
                const budget = budgetMatch ? budgetMatch.replace('Budget: ', '') : '';
                
                let selectedItems: string[] = [];
                if (selectedItemsStart !== -1) {
                  const itemsEnd = specialReqStart !== -1 ? specialReqStart : lines.length;
                  selectedItems = lines.slice(selectedItemsStart + 1, itemsEnd)
                    .filter(line => line.trim().startsWith('-'))
                    .map(line => line.replace('- ', ''));
                }
                
                let specialRequirements = '';
                if (specialReqStart !== -1) {
                  const reqLines = lines.slice(specialReqStart + 1)
                    .filter(line => line.trim() !== '' && line.trim() !== 'None')
                    .map(line => line.trim());
                  specialRequirements = reqLines.join('\n').trim();
                }
                
                return { eventType, budget, selectedItems, specialRequirements };
              })();
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Customer Information</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Name:</strong> {selectedRequest.requester_name}</div>
                          <div><strong>Email:</strong> {selectedRequest.requester_email}</div>
                          <div><strong>Phone:</strong> {selectedRequest.requester_phone}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Event Details</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Type:</strong> {parsed.eventType || 'Not specified'}</div>
                          <div><strong>Date:</strong> {selectedRequest.event_date ? new Date(selectedRequest.event_date).toLocaleDateString('en-GB') : 'TBD'}</div>
                          <div><strong>Time:</strong> {selectedRequest.event_time || 'TBD'}</div>
                          <div><strong>Location:</strong> {selectedRequest.event_location}</div>
                          <div><strong>Guests:</strong> {selectedRequest.total_estimated_guests || selectedRequest.number_of_guests}</div>
                          <div><strong>Budget:</strong> {parsed.budget || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Selected Items</h3>
                        {parsed.selectedItems.length > 0 ? (
                          <div className="space-y-2">
                            {parsed.selectedItems.map((item, idx) => (
                              <div key={idx} className="bg-muted p-3 rounded text-sm">
                                {item}
                              </div>
                            ))}
                          </div>
                        ) : selectedRequest.product_name ? (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                            <div className="font-medium text-blue-800">{selectedRequest.product_name}</div>
                            <div className="text-sm text-blue-600">Single product catering request</div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">No items specified</div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Allergies & Special Requirements</h3>
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                          {parsed.specialRequirements || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Submitted: {new Date(selectedRequest.submitted_at).toLocaleString('en-GB')}
                      </div>
                      <Badge className={
                        selectedRequest.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedRequest.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        selectedRequest.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                        selectedRequest.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {selectedRequest.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        {/* Invoice Modal */}
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setInvoiceRequest(null);
          }}
          cateringRequest={invoiceRequest}
        />
      </div>
    </AdminLayout>
  );
}