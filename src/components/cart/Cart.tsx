import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brandContent } from "@/data/menu";

export function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateSpiceLevel,
    updateCustomization,
    totalAmount,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some delicious meals to get started
          </p>
          <Link to="/menu">
            <Button variant="wine">Browse Menu</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        {/* Back Link */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Your Cart
            </h1>

            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.spiceLevel}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 md:p-6 shadow-soft"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Product Image */}
                  {item.image && (
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Item Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-golden">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Spice Level */}
                    <div className="mb-4">
                      <Label className="text-sm mb-2 block">Spice Level</Label>
                      <div className="flex gap-2">
                        {(["Mild", "Medium", "Hot"] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => updateSpiceLevel(item.id, level)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                              item.spiceLevel === level
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customization */}
                    <div>
                      <Label className="text-sm mb-2 block">
                        Customization Note
                      </Label>
                      <Input
                        placeholder="Any special requests..."
                        value={item.customizationNote || ""}
                        onChange={(e) =>
                          updateCustomization(item.id, e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-background rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-background rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">£{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-golden">
                      £{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Processing Time Notice */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-primary text-center">
                  {brandContent.orderProcessing}
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {brandContent.shippingNote}
                </p>
              </div>

              <Link to="/checkout">
                <Button variant="golden" className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                We accept PayPal and Stripe payments only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
