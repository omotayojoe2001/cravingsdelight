import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string | null;
  rating: number | null;
  review_text: string;
  is_approved: boolean;
  submitted_at: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  async function updateReviewStatus(id: string, is_approved: boolean) {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved })
        .eq('id', id);

      if (error) throw error;

      toast.success(is_approved ? 'Review approved' : 'Review rejected');
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        <h1 className="font-display text-4xl font-bold mb-8">Reviews Management</h1>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground">No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {review.customer_name || 'Anonymous'}
                      </CardTitle>
                      {review.rating && (
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating!
                                  ? 'fill-golden text-golden'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        review.is_approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{review.review_text}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.submitted_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {!review.is_approved && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateReviewStatus(review.id, true)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReviewStatus(review.id, false)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Unapprove
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
