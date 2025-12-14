import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { menuItems } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try to find in static menu items
        const staticProduct = menuItems.find((item) => item.id === id);
        if (staticProduct) {
          setProduct(staticProduct);
          setLoading(false);
          return;
        }
        
        // Then try to fetch from database
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching product:', error);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  const [selectedSpice, setSelectedSpice] = useState<"Mild" | "Medium" | "Hot">("Medium");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [customizationNote, setCustomizationNote] = useState("");
  
  const currentPrice = selectedSize && product?.sizes ? product.sizes[selectedSize] : product?.price || 0;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/menu">
              <Button>Back to Menu</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSpice, customizationNote);
    }
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-2xl shadow-elevated"
                />
              )}
              <span className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium capitalize bg-primary text-primary-foreground">
                {product.category}
              </span>
            </motion.div>

            {/* Product Info & Order Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-golden mb-6">
                  {product.sizes ? "From " : ""}£{currentPrice.toFixed(2)}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Order Form */}
              <div className="bg-card rounded-xl p-6 shadow-soft space-y-6">
                <h3 className="font-display text-xl font-semibold">Customize Your Order</h3>

                {/* Size Selection */}
                {product.sizes && (
                  <div>
                    <Label>Select Size</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(product.sizes).map(([size, price]) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                            selectedSize === size
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <div>{size}</div>
                          <div className="text-xs">£{price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-wine" />
                    <Label>Spice Level</Label>
                  </div>
                  <div className="flex gap-2">
                    {(["Mild", "Medium", "Hot"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedSpice(level)}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedSpice === level
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Note */}
                <div>
                  <Label htmlFor="customization">Special Requests (Optional)</Label>
                  <Textarea
                    id="customization"
                    value={customizationNote}
                    onChange={(e) => setCustomizationNote(e.target.value)}
                    placeholder="Any special requests or dietary requirements..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-golden">
                      £{(currentPrice * quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button onClick={handleOrderNow} variant="golden" className="w-full" size="lg">
                      Order Now
                    </Button>
                    <Button onClick={handleAddToCart} variant="outline" className="w-full" size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
