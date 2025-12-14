import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Eye } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export function MenuCard({ item, index }: MenuCardProps) {
  const [selectedSpice, setSelectedSpice] = useState<"Mild" | "Medium" | "Hot">("Medium");
  const { addItem } = useCart();

  const spiceLevels: Array<"Mild" | "Medium" | "Hot"> = ["Mild", "Medium", "Hot"];

  const handleAddToCart = () => {
    addItem(item, selectedSpice);
    toast.success(`${item.name} added to cart!`, {
      description: `Spice level: ${selectedSpice}`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "rice":
        return "bg-golden/20 text-golden-dark";
      case "soup":
        return "bg-wine/20 text-wine";
      case "special":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Compact Product Image */}
      <Link to={`/product/${item.id}`}>
        <div className="relative h-32 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-1">🍽️</div>
                <span className="text-xs text-muted-foreground">No Image</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <span className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
            £{item.price.toFixed(2)}
          </span>
        </div>
      </Link>

      <div className="p-3">
        {/* Compact Name */}
        <Link to={`/product/${item.id}`}>
          <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
            {item.name}
          </h3>
        </Link>
        
        {/* Quick Spice & Add */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {spiceLevels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedSpice(level)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  selectedSpice === level
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title={level}
              >
                {level.charAt(0)}
              </button>
            ))}
          </div>
          <Button
            onClick={handleAddToCart}
            size="sm"
            variant="golden"
            className="h-8 px-3"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
