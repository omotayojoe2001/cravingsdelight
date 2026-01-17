import { motion } from "framer-motion";
import { MenuCard } from "./MenuCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Utensils, ChefHat, Soup, Salad, Star, Fish, Wheat, Apple, Coffee, Beef, Sandwich } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const categories = [
  { id: "all", label: "All" },
  { id: "rice", label: "Rice Dishes" },
  { id: "proteins", label: "Proteins" },
  { id: "vegetables", label: "Vegetables" },
  { id: "soup", label: "Soups" },
  { id: "sides", label: "Sides" },
  { id: "appetizers", label: "Appetizers" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
  { id: "seafood", label: "Seafood" },
  { id: "pasta", label: "Pasta" },
  { id: "salads", label: "Salads" },
  { id: "grains", label: "Grains" },
  { id: "special", label: "Specials" },
];

export function MenuGrid() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = products
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section className="py-0">
      <div>
        {/* Section Header */}
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
            Signature <span className="text-gradient-wine">Delicacies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Made from premium African ingredients, our meals are curated with
            accuracy and precision. Every dish is a promise of excellence kept.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Category Filter - Unique Hexagonal Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Decorative Background Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-golden/20 to-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-wine/20 rounded-full blur-2xl" />
            
            {/* Main Container */}
            <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-8 border border-slate-200/50 shadow-xl">
              {/* Category Title */}
              <div className="text-center mb-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Explore Our <span className="text-gradient-wine">Flavors</span>
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-golden to-primary mx-auto rounded-full" />
              </div>
              
              {/* Hexagonal Category Grid */}
              <div className="grid grid-cols-7 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4">
                {categories.map((cat, index) => {
                  const isActive = activeCategory === cat.id;
                  const categoryIcons = {
                    all: Utensils,
                    rice: ChefHat,
                    proteins: Beef,
                    vegetables: Apple,
                    soup: Soup,
                    sides: Salad,
                    appetizers: Sandwich,
                    desserts: Star,
                    beverages: Coffee,
                    seafood: Fish,
                    pasta: Wheat,
                    salads: Salad,
                    grains: Wheat,
                    special: Star
                  };
                  const IconComponent = categoryIcons[cat.id as keyof typeof categoryIcons];
                  
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.15,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(cat.id)}
                      className="group relative"
                    >
                      {/* Hexagonal Shape */}
                      <div className={`relative w-16 h-16 md:w-24 md:h-24 transition-all duration-500 ${
                        isActive ? "drop-shadow-2xl" : "drop-shadow-lg hover:drop-shadow-xl"
                      }`}>
                        {/* Background Hexagon */}
                        <div className={`absolute inset-0 transition-all duration-500 ${
                          isActive 
                            ? "bg-gradient-to-br from-primary via-wine to-golden" 
                            : "bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300"
                        }`} 
                        style={{
                          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                        }} />
                        
                        {/* Inner Content */}
                        <div className="absolute inset-1 md:inset-2 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
                        style={{
                          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                        }}>
                          <IconComponent className={`w-4 h-4 md:w-6 md:h-6 mb-0.5 md:mb-1 ${
                            isActive ? "text-primary" : "text-slate-600"
                          }`} />
                          <span className={`text-[8px] md:text-xs font-bold text-center leading-tight hidden md:block ${
                            isActive ? "text-primary" : "text-slate-600"
                          }`}>
                            {cat.label.split(' ').map((word, i) => (
                              <div key={i}>{word}</div>
                            ))}
                          </span>
                        </div>
                        
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeHex"
                            className="absolute -inset-1 bg-gradient-to-r from-golden via-primary to-wine opacity-75 blur-sm"
                            style={{
                              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                            }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                          />
                        )}
                      </div>
                      
                      {/* Category Label */}
                      <div className="mt-2 md:mt-3 text-center">
                        <span className={`text-xs md:text-sm font-semibold transition-colors ${
                          isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-800"
                        }`}>
                          {cat.label}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
