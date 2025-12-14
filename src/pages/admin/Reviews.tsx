import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Star, Check, X, Mail, Clock } from 'lucide-react';
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
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    console.log('Fetching reviews...');
    setLoading(true);
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    
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

        {/* Reviews Content */}
        <div className="flex-1 overflow-hidden">
          {reviews.length === 0 ? (
            <div className="bg-card rounded-lg border p-12 text-center">
              <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No {filter !== 'all' ? filter : ''} reviews</h3>
              <p className="text-muted-foreground">Customer reviews will appear here once submitted</p>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{review.customer_name || 'Anonymous'}</p>
                        {review.customer_email && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{review.customer_email}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={review.is_approved ? 'default' : 'secondary'} className="text-xs">
                        {review.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {review.rating ? (
                        [...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating! ? 'fill-golden text-golden' : 'text-gray-300'}`}
                          />
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No rating</span>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{review.review_text}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                      
                      {!review.is_approved ? (
                        <Button size="sm" onClick={() => updateStatus(review.id, true)} className="h-7 px-3">
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(review.id, false)} className="h-7 px-3">
                          <X className="h-3 w-3 mr-1" />
                          Unapprove
                        </Button>
                      )}
                    </div>
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
