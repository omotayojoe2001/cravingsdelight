import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MenuCard } from "./MenuCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_active: boolean;
}

export function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  async function fetchFeaturedProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (data) setFeaturedItems(data);
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
            Our Menu
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient-wine">Dishes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular authentic African dishes
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
          {featuredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/menu">
            <Button variant="wine" size="lg">
              View Full Menu
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
