import { motion } from "framer-motion";
import { brandContent } from "@/data/menu";
import { UtensilsCrossed, Clock, Truck, Heart } from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Premium Ingredients",
    description: "Made from authentic African ingredients sourced with care",
  },
  {
    icon: Clock,
    title: "Made Fresh",
    description: "Every order is prepared fresh just for you",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "3-5 working days after payment confirmation",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each dish carries our passion for excellence",
  },
];

export function Services() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
            What We Offer
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our <span className="text-gradient-wine">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            {brandContent.servicesBlurb}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-golden/10 flex items-center justify-center mb-4 group-hover:bg-golden/20 transition-colors">
                <feature.icon className="h-6 w-6 text-golden" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Menu Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
            In addition to our featured delicacies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              "ASUN (peppered goat meat)",
              "Peppersoup (assorted varieties)",
              "Seafood Rice",
              "Fried Rice",
              "Coconut Rice",
              "Local Rice",
              "Moimoi",
              "And more...",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 rounded-lg px-4 py-3 text-center text-sm font-medium"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-center text-primary-foreground/90 max-w-2xl mx-auto mb-6">
            We offer indoor and outdoor catering services carefully curated to
            taste and guests pleasure. Please send an email to book a session to
            discuss your catering needs.
          </p>
          <div className="text-center">
            <a href="/catering">
              <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-3 rounded-lg transition-colors">
                Book Catering Now
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
