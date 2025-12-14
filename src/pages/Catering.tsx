import { Layout } from "@/components/layout/Layout";
import { CateringForm } from "@/components/forms/CateringForm";
import { CateringGallery } from "@/components/catering/CateringGallery";
import { motion } from "framer-motion";
import { brandContent } from "@/data/menu";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_active: boolean;
  available_for_catering: boolean;
}

const Catering = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cateringProducts, setCateringProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetchCateringProducts();
  }, []);
  
  async function fetchCateringProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('available_for_catering', true)
      .order('name');
    if (data) setCateringProducts(data);
  }
  
  const filteredItems = cateringProducts.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Layout>
      <SEOHead 
        title="Catering Services - African Event Catering | Cravings Delight Hull"
        description="Professional African catering for weddings, parties, corporate events in Hull. Jollof rice, Peppersoup, Asun, soups & more. Indoor & outdoor catering available. Request a quote today."
        keywords="African catering Hull, Nigerian catering UK, event catering Hull, wedding catering, party catering, corporate catering, African food events"
      />
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Catering <span className="text-gradient-wine">Services</span>
            </h1>
            <p className="text-muted-foreground mb-6">
              We offer indoor and outdoor catering services carefully curated to
              taste and guests pleasure. Let us make your event unforgettable
              with authentic African cuisine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden shadow-elevated"
          >
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80"
              alt="Catering Event"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
              <div className="container mx-auto px-8 md:px-16">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
                  Make Your Event Special
                </h2>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                  Professional catering for weddings, parties, corporate events & more
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catering Form First */}
      <CateringForm />

      {/* Available Items */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Available for <span className="text-gradient-wine">Catering</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Choose from our menu items available for catering. Contact us for custom quotes and bulk pricing.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search catering items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item, index) => (
              <Link key={item.id} to={`/catering/${item.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all group cursor-pointer"
                >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-sm font-medium text-primary mt-2">From £{item.price.toFixed(2)}</p>
                </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-primary rounded-2xl p-8 text-center text-primary-foreground"
          >
            <p className="text-lg mb-2">
              Contact us to discuss your catering needs
            </p>
            <a
              href={`mailto:${brandContent.contactEmail}`}
              className="text-2xl font-bold underline hover:opacity-80 transition-opacity"
            >
              {brandContent.contactEmail}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <CateringGallery />

      {/* Catering Form Again at End */}
      <CateringForm />
    </Layout>
  );
};

export default Catering;
