import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Check, X, Mail, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  rating: number | null;
  review_text: string;
  is_approved: boolean;
  submitted_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReviews();
    
    // Auto-refresh every 30 seconds to show new reviews
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchReviews() {
    console.log('Fetching reviews...');
    setLoading(true);
    let query = supabase.from('reviews').select('*').order('submitted_at', { ascending: false });
    
    if (filter === 'approved') query = query.eq('is_approved', true);
    if (filter === 'pending') query = query.eq('is_approved', false);
    
    const { data, error } = await query;
    if (error) {
      console.error('❌ FETCH REVIEWS ERROR:', error);
    } else {
      console.log('✅ REVIEWS FETCHED:', data?.length || 0, 'reviews');
      setReviews(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  async function updateStatus(id: string, is_approved: boolean) {
    const { error } = await supabase.from('reviews').update({ is_approved }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success(is_approved ? 'Review approved' : 'Review unapproved');
      fetchReviews();
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedReviews(checked ? reviews.map(r => r.id) : []);
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    setSelectedReviews(prev => 
      checked ? [...prev, reviewId] : prev.filter(id => id !== reviewId)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;
    if (!confirm(`Delete ${selectedReviews.length} selected reviews? This action cannot be undone.`)) return;
    
    setDeleting(true);
    const { error } = await supabase.from('reviews').delete().in('id', selectedReviews);
    
    if (error) {
      toast.error('Failed to delete reviews');
    } else {
      toast.success(`${selectedReviews.length} reviews deleted`);
      setSelectedReviews([]);
      fetchReviews();
    }
    setDeleting(false);
  };

  const handleDeleteSingle = async (reviewId: string) => {
    if (!confirm('Delete this review? This action cannot be undone.')) return;
    
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) {
      toast.error('Failed to delete review');
    } else {
      toast.success('Review deleted');
      fetchReviews();
    }
  };

  const pendingCount = reviews.filter(r => !r.is_approved).length;
  const approvedCount = reviews.filter(r => r.is_approved).length;

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="h-full max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Reviews</h1>
            <p className="text-sm text-muted-foreground">
              {pendingCount} pending • {approvedCount} approved
            </p>
          </div>
          <div className="flex gap-3">
            {selectedReviews.length > 0 && (
              <Button 
                onClick={handleBulkDelete} 
                variant="destructive" 
                size="sm"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : `Delete ${selectedReviews.length}`}
              </Button>
            )}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
                <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews Table - Compact Format */}
        <div className="flex-1 overflow-hidden bg-white border rounded-lg">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedReviews.length === reviews.length && reviews.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No {filter !== 'all' ? filter : ''} reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => {
                    const reviewDate = new Date(review.submitted_at);
                    return (
                      <TableRow key={review.id} className="py-2">
                        <TableCell className="py-2">
                          <input
                            type="checkbox"
                            checked={selectedReviews.includes(review.id)}
                            onChange={(e) => handleSelectReview(review.id, e.target.checked)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs py-2">#{review.id.slice(0, 6)}</TableCell>
                        <TableCell className="py-2">
                          <div className="font-medium text-sm">{review.customer_name || 'Anonymous'}</div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="text-sm truncate max-w-32">
                            {review.customer_email ? review.customer_email.split('@')[0] : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1">
                            {review.rating ? (
                              [...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating! ? 'fill-golden text-golden' : 'text-gray-300'}`}
                                />
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No rating</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="text-sm max-w-48 truncate">{review.review_text}</div>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge variant={review.is_approved ? 'default' : 'secondary'} className="text-xs">
                            {review.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="text-xs">
                            <div>{reviewDate.toLocaleDateString('en-GB')}</div>
                            <div className="text-muted-foreground">{reviewDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex gap-1">
                            {!review.is_approved ? (
                              <Button size="sm" onClick={() => updateStatus(review.id, true)} className="h-7 w-7 p-0">
                                <Check className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => updateStatus(review.id, false)} className="h-7 w-7 p-0">
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteSingle(review.id)} className="h-7 w-7 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
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
