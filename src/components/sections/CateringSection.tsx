import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin } from "lucide-react";
import { brandContent } from "@/data/menu";

export function CateringSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
              Events & Celebrations
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Catering <span className="text-gradient-wine">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              We offer indoor and outdoor catering services carefully curated to
              taste and guests pleasure. Let us bring the authentic taste of
              African cuisine to your special events.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
                <Calendar className="h-5 w-5 text-golden" />
                <span className="text-sm font-medium">Any Occasion</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
                <Users className="h-5 w-5 text-golden" />
                <span className="text-sm font-medium">All Sizes</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
                <MapPin className="h-5 w-5 text-golden" />
                <span className="text-sm font-medium">Indoor & Outdoor</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Please send an email to book a session to discuss your catering
              needs at{" "}
              <a
                href={`mailto:${brandContent.contactEmail}`}
                className="text-primary font-medium hover:underline"
              >
                {brandContent.contactEmail}
              </a>
            </p>

            <Link to="/catering">
              <Button variant="wine" size="lg">
                Request Catering Quote
              </Button>
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-primary-foreground">
              <h3 className="font-display text-2xl font-bold mb-6">
                Available for Catering:
              </h3>
              <ul className="space-y-3">
                {[
                  "ASUN (peppered goat meat)",
                  "Peppersoup (assorted, goat meat, cat fish, chicken and turkey)",
                  "Seafood rice",
                  "Fried rice",
                  "Coconut rice",
                  "Local rice",
                  "Moimoi",
                  "All our signature soups and stews",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-golden" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Decorative */}
            <div className="absolute -z-10 -right-4 -bottom-4 w-full h-full bg-golden/30 rounded-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
