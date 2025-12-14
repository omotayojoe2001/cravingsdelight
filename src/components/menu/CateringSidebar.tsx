import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone } from "lucide-react";
import { brandContent } from "@/data/menu";

export function CateringSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Catering CTA */}
      <div className="bg-primary rounded-xl p-6 text-primary-foreground sticky top-24">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5" />
          <h3 className="font-display text-xl font-bold">Catering Services</h3>
        </div>
        <p className="text-sm text-primary-foreground/90 mb-4">
          Planning an event? We offer indoor and outdoor catering with authentic African cuisine.
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${brandContent.contactEmail}`} className="hover:underline">
              {brandContent.contactEmail}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>WhatsApp Available</span>
          </div>
        </div>

        <Link to="/catering">
          <Button variant="secondary" className="w-full">
            View Catering Menu
          </Button>
        </Link>
      </div>

      {/* Processing Notice */}
      <div className="bg-card rounded-xl p-6 shadow-soft">
        <h4 className="font-semibold text-foreground mb-2">Order Processing</h4>
        <p className="text-sm text-muted-foreground">
          {brandContent.orderProcessing}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {brandContent.shippingNote}
        </p>
      </div>
    </motion.div>
  );
}
