import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Star, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string;
  submitted_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('submitted_at', { ascending: false });

    if (data) setReviews(data);
    setLoading(false);
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

  function shareReview(reviewId: string) {
    const url = `${window.location.origin}/reviews/${reviewId}`;
    navigator.clipboard.writeText(url);
    toast.success('Review link copied to clipboard!');
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading reviews...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead 
        title="Customer Reviews - What People Say | Cravings Delight Hull"
        description="Read authentic customer reviews about Cravings Delight. See what people say about our African cuisine, service, and catering in Hull, UK."
        keywords="Cravings Delight reviews, African food reviews Hull, customer testimonials, restaurant reviews"
      />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
              Testimonials
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Customer <span className="text-gradient-wine">Reviews</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about their experience with Cravings Delight
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border p-8 mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-8 w-8 fill-golden text-golden" />
              <span className="text-5xl font-bold">{avgRating}</span>
            </div>
            <p className="text-muted-foreground">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </motion.div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="font-display font-semibold text-lg">{review.customer_name}</p>
                    {review.customer_email && (
                      <p className="text-sm text-muted-foreground">{maskEmail(review.customer_email)}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareReview(review.id)}
                    className="flex-shrink-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'fill-golden text-golden' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {review.review_text}
                </p>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {timeAgo(review.submitted_at)}
                </div>
              </motion.div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
