import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CateringForm } from '@/components/forms/CateringForm';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SEOHead } from '@/components/SEOHead';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function CateringProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('available_for_catering', true)
      .single();
    
    setProduct(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not available for catering</h1>
            <Link to="/catering">
              <Button>Back to Catering</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead 
        title={`${product.name} Catering - African Event Catering | Cravings Delight Hull`}
        description={`Professional catering for ${product.name}. ${product.description} Perfect for weddings, parties, corporate events in Hull. Request a quote today.`}
      />
      
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <Link
            to="/catering"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catering
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-primary mb-6">
                  From £{product.price.toFixed(2)} per portion
                </div>
              </div>

              {/* Catering Features */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold mb-4">Catering Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Suitable for events of all sizes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Fresh preparation on event day</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Indoor & outdoor catering available</span>
                  </div>
                </div>
              </div>

              {/* Pricing Note */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold text-primary mb-2">Custom Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Catering prices vary based on guest count, location, and additional services. 
                  Contact us for a personalized quote for your event.
                </p>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    const form = document.getElementById('catering-form');
                    form?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Request Quote for {product.name}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catering Form */}
      <div id="catering-form">
        <CateringForm />
      </div>
    </Layout>
  );
}