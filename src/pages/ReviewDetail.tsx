import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Star, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, [id]);

  async function fetchReview() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('is_approved', true)
      .single();

    if (data) setReview(data);
    setLoading(false);
  }

  function maskEmail(email: string | null) {
    if (!email) return null;
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading review...</p>
        </div>
      </Layout>
    );
  }

  if (!review) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Review not found</h2>
          <Link to="/reviews">
            <Button variant="wine">View All Reviews</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead 
        title={`Review by ${review.customer_name} - Cravings Delight`}
        description={review.review_text.slice(0, 150)}
        type="article"
      />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <Link to="/reviews" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to All Reviews
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl border p-8 md:p-12 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-golden/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 fill-golden text-golden" />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {review.customer_name}
                </h1>
                {review.customer_email && (
                  <p className="text-muted-foreground">{maskEmail(review.customer_email)}</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < review.rating ? 'fill-golden text-golden' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-muted rounded-lg p-6 mb-6">
                <p className="text-lg leading-relaxed text-foreground">
                  "{review.review_text}"
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{new Date(review.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>

              <div className="mt-8 pt-8 border-t text-center">
                <p className="text-muted-foreground mb-4">
                  Thank you for choosing Cravings Delight!
                </p>
                <Link to="/menu">
                  <Button variant="wine">Order Now</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
