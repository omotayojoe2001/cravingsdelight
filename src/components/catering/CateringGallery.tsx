import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Event Setup Images (long UUID names)
const eventSetupImages = [
  {
    id: 1,
    src: "/0bf85b5c-ef7a-4f53-8c14-d315651b1757.jpeg",
    alt: "Elegant event table setup with premium decoration",
    category: "Event Setup"
  },
  {
    id: 2,
    src: "/266b637c-7178-41fa-8a4e-ae1a6a2f597b.jpeg",
    alt: "Professional catering arrangement",
    category: "Event Setup"
  },
  {
    id: 3,
    src: "/3af945d0-ccd6-43eb-be28-fb45bcf391aa.jpeg",
    alt: "Luxury banquet hall setup",
    category: "Event Setup"
  },
  {
    id: 4,
    src: "/b8a63ae6-ab0d-494a-bf0e-f2fc71a0cdb2.jpeg",
    alt: "Corporate event dining setup",
    category: "Event Setup"
  },
  {
    id: 5,
    src: "/c2ad115c-fef5-4681-b3e8-e63ad145a0b0.jpeg",
    alt: "Premium event venue arrangement",
    category: "Event Setup"
  }
];

// Food Images (descriptive food names)
const foodImages = [
  {
    id: 6,
    src: "/beef.jpeg",
    alt: "Tender beef preparation",
    category: "Food"
  },
  {
    id: 7,
    src: "/egusi soup.jpeg",
    alt: "Traditional Egusi soup",
    category: "Food"
  },
  {
    id: 8,
    src: "/food nice meal.jpeg",
    alt: "Beautiful African meal presentation",
    category: "Food"
  },
  {
    id: 9,
    src: "/foood.jpeg",
    alt: "Delicious African cuisine",
    category: "Food"
  },
  {
    id: 10,
    src: "/pepper meat.jpeg",
    alt: "Spicy pepper meat dish",
    category: "Food"
  },
  {
    id: 11,
    src: "/plenty jollof.jpeg",
    alt: "Abundant Jollof rice serving",
    category: "Food"
  },
  {
    id: 12,
    src: "/rice jollof.jpeg",
    alt: "Perfect Jollof rice",
    category: "Food"
  },
  {
    id: 13,
    src: "/soup bow;l.jpeg",
    alt: "Traditional soup in bowl",
    category: "Food"
  },
  {
    id: 14,
    src: "/soup.jpeg",
    alt: "Rich African soup",
    category: "Food"
  },
  {
    id: 15,
    src: "/sweet food.jpeg",
    alt: "Sweet African delicacy",
    category: "Food"
  },
  {
    id: 16,
    src: "/vegetable protein.jpeg",
    alt: "Vegetable and protein combination",
    category: "Food"
  },
  {
    id: 17,
    src: "/veggies salad.jpeg",
    alt: "Fresh vegetable salad",
    category: "Food"
  }
];

export function CateringGallery() {
  const [activeCategory, setActiveCategory] = useState<'setup' | 'food'>('setup');
  const [isPlaying, setIsPlaying] = useState(true);
  const setupCarouselRef = useRef<HTMLDivElement>(null);
  const foodCarouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right', category: 'setup' | 'food') => {
    const carousel = category === 'setup' ? setupCarouselRef.current : foodCarouselRef.current;
    if (!carousel) return;
    
    const scrollAmount = 320;
    carousel.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-golden/5 to-primary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-golden rounded-full" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-primary rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-golden/20 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <span className="text-golden font-medium text-sm tracking-widest uppercase mb-3 block">
              Visual Experience
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Our Catering
              <br />
              <span className="text-gradient-wine italic">Masterpieces</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-golden to-primary mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              From elegant table settings to mouth-watering presentations, witness the artistry behind every event we cater
            </p>
          </div>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveCategory('setup')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === 'setup'
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Event Setups
              </button>
              <button
                onClick={() => setActiveCategory('food')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === 'food'
                    ? 'bg-gradient-to-r from-golden to-golden/80 text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Food Gallery
              </button>
            </div>
          </div>
        </motion.div>

        {/* Event Setup Carousel */}
        {activeCategory === 'setup' && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Elegant Event Setups</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollCarousel('left', 'setup')}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollCarousel('right', 'setup')}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              ref={setupCarouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {eventSetupImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex-shrink-0 w-80 h-64 group cursor-pointer"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Food Gallery Carousel */}
        {activeCategory === 'food' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Culinary Artistry</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollCarousel('left', 'food')}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollCarousel('right', 'food')}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              ref={foodCarouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {foodImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex-shrink-0 w-80 h-64 group cursor-pointer"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}