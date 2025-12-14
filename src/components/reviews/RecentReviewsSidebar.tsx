import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string;
  created_at: string;
}

export function RecentReviewsSidebar() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setReviews(data);
  }

  function maskEmail(email: string | null) {
    if (!email) return null;
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  }

  if (reviews.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold">Recent Reviews</h3>
        <Link to="/reviews" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{review.customer_name}</p>
                {review.customer_email && (
                  <p className="text-xs text-muted-foreground">{maskEmail(review.customer_email)}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating ? 'fill-golden text-golden' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
              {review.review_text}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo(review.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
