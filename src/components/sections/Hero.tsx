import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useState, useEffect } from "react";

export function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const phrases = [
    "A Taste of Home, Delivered to You",
    "Premium Kitchen Cuisine",
    "Authentic African Flavors",
    "Fresh Ingredients, Bold Taste"
  ];
  
  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, phrases]);
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Delicious African cuisine"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wine/95 via-wine/80 to-wine-dark/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-golden mb-4"
          >
            <Utensils className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Premium African Cuisine
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight min-h-[1.2em]"
          >
            <span className="text-golden">{displayText}</span>
            <span className="animate-pulse text-golden">|</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed"
          >
            We offer soup and meal bowls services based on preorder. Each meal
            or soup bowl can be customised to fit your desired taste. Made from
            premium African ingredients our meals are curated with accuracy and
            precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/menu">
              <Button variant="hero" size="xl">
                Order Now
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <Link to="/catering">
              <Button variant="heroOutline" size="xl">
                Book Catering
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex items-center gap-6 text-primary-foreground/70"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-golden">50+</span>
              <span className="text-sm">Happy Customers</span>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-golden">13+</span>
              <span className="text-sm">Signature Dishes</span>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-golden">100%</span>
              <span className="text-sm">Fresh Ingredients</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Kitchen Utensils */}
      <motion.div
        animate={{ 
          y: [-30, 30, -30],
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 text-golden opacity-30"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L9.7 14.7l.7.7 4.38-4.17z"/>
        </svg>
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [25, -25, 25],
          rotate: [0, -20, 20, 0],
          x: [-5, 5, -5]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-40 right-40 text-golden opacity-25"
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8.69V4h-2c-2.21 0-4 1.79-4 4v6h6V9.5c0-.28-.11-.53-.29-.71L20 8.69zM12 2h2v20h-2V2zm-8 6.69V4H2c-2.21 0-4 1.79-4 4v6h6V9.5c0-.28.11-.53.29-.71L4 8.69z"/>
        </svg>
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          rotate: [0, 10, -10, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-40 right-10 text-golden opacity-20"
      >
        <svg width="55" height="55" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.9 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8.9-4z"/>
        </svg>
      </motion.div>
      
      {/* Dancing Knife and Fork */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.3, 1],
          y: [-10, 10, -10]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-60 text-golden opacity-40"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.1 7.3L1 8.4l8.6 8.6 1.1-1.1L2.1 7.3zm19.8 8.6l-8.6-8.6-1.1 1.1 8.6 8.6 1.1-1.1zM12 2l-1.4 1.4L16.2 9l1.4-1.4L12 2z"/>
        </svg>
      </motion.div>
      
      <motion.div
        animate={{ 
          rotate: [0, -360],
          scale: [1, 1.2, 1],
          x: [-8, 8, -8]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-60 right-32 text-golden opacity-35"
      >
        <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </motion.div>
      
      {/* Glowing Background Effects */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-golden blur-3xl"
      />
      
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-wine blur-3xl"
      />
    </section>
  );
}
