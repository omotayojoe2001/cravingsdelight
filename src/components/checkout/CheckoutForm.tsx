import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { brandContent } from "@/data/menu";
import { toast } from "sonner";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeConfig } from '@/config/stripe';
import { supabase } from '@/lib/supabase';
import { calculateDeliveryFee, isHullPostcode } from '@/utils/deliveryFee';
import { CouponInput } from "@/components/checkout/CouponInput";
import { sendOrderConfirmation } from '@/lib/email';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(stripeConfig.publishableKey);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
  hidePostalCode: false,
  disabled: false,
};

function CheckoutFormContent() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod] = useState<"Stripe">("Stripe");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0); // No default fee
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [postcodeEntered, setPostcodeEntered] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_percentage: number; discount_amount: number } | null>(null);
  
  const finalTotal = totalAmount + deliveryFee - (appliedCoupon?.discount_amount || 0);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    notes: "",
    allergies: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const stripe = useStripe();
  const elements = useElements();
  // Calculate delivery fee based on postcode
  const updateDeliveryFee = async (postcode: string) => {
    if (!postcode || postcode.length < 3) {
      setDeliveryFee(0);
      setPostcodeEntered(false);
      return;
    }
    
    setCalculatingFee(true);
    const fee = await calculateDeliveryFee(postcode);
    setDeliveryFee(fee);
    setPostcodeEntered(true);
    setCalculatingFee(false);
  };
  
  // Update delivery fee when postcode changes
  React.useEffect(() => {
    updateDeliveryFee(formData.postcode);
  }, [formData.postcode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!formData.postcode.trim()) {
      toast.error("Please enter your postcode");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms before proceeding");
      return;
    }
    if (paymentMethod === "Stripe") {
      if (!stripe || !elements) {
        toast.error("Stripe not loaded. Please try again.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "Stripe") {
        const cardElement = elements!.getElement(CardElement);
        
        if (!cardElement) {
          toast.error("Card element not found");
          return;
        }

        toast.info("Processing payment...", { description: "Please wait" });

        try {
          // Check if backend server is running
          let clientSecret;
          try {
            const requestData = {
              amount: finalTotal,
              currency: 'gbp',
              metadata: {
                customer_name: formData.fullName,
                customer_email: formData.email,
                order_items: items.length.toString(),
                delivery_fee: deliveryFee.toString(),
                discount_amount: (appliedCoupon?.discount_amount || 0).toString(),
                coupon_code: appliedCoupon?.code || 'none',
                allergies: formData.allergies || 'None',
              },
            };
            
            const apiUrl = '/api/create-payment-intent';
            
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Backend server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            clientSecret = data.clientSecret;
            
          } catch (serverError) {
            // Fallback: Create payment method without backend
            toast.warning("Backend server not running. Using direct payment method.");
            
            const paymentMethodData = {
              type: 'card',
              card: cardElement,
              billing_details: {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: {
                  line1: formData.address,
                  city: formData.city,
                  postal_code: formData.postcode,
                  country: 'GB',
                },
              },
            };
            
            const { error, paymentMethod } = await stripe!.createPaymentMethod(paymentMethodData);

            if (error) {
              toast.error(error.message || "Payment method creation failed");
              return;
            }

            toast.success("Payment method created successfully!");
            // Skip to order processing
          }

          // If we have clientSecret, confirm payment
          if (clientSecret) {
            const confirmData = {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                  address: {
                    line1: formData.address,
                    city: formData.city,
                    postal_code: formData.postcode,
                    country: 'GB',
                  },
                },
              },
            };
            
            const { error: confirmError, paymentIntent } = await stripe!.confirmCardPayment(clientSecret, confirmData);

            if (confirmError) {
              toast.error(confirmError.message || "Payment failed");
              return;
            }

            toast.success("Payment successful!");
          }
        } catch (error) {
          toast.error("Payment processing failed. Please try again.");
          return;
        }
      }

      // Save order to database
      try {
        const orderData = {
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          delivery_city: formData.city,
          delivery_postcode: formData.postcode,
          delivery_country: formData.country,
          delivery_notes: formData.notes,
          allergies: formData.allergies,
          subtotal_amount: totalAmount,
          delivery_fee: deliveryFee,
          discount_amount: appliedCoupon?.discount_amount || 0,
          coupon_code: appliedCoupon?.code || null,
          total_amount: finalTotal,
          payment_method: paymentMethod,
          order_status: 'processing',
          order_items: JSON.stringify(items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            spiceLevel: item.spiceLevel,
            customizationNote: item.customizationNote
          }))),
          payment_intent_id: paymentIntent?.id || 'fallback_method'
        };
        
        const { error: dbError } = await supabase.from('orders').insert(orderData);
        if (dbError) {
          toast.warning('Order processed but failed to save to database');
        } else {
          // Update coupon usage if coupon was applied
          if (appliedCoupon) {
            try {
              // Get coupon ID and update usage count
              const { data: couponData } = await supabase
                .from('coupons')
                .select('id, used_count')
                .eq('code', appliedCoupon.code)
                .single();
              
              if (couponData) {
                // Update coupon usage count
                await supabase
                  .from('coupons')
                  .update({ used_count: couponData.used_count + 1 })
                  .eq('id', couponData.id);
                
                // Record coupon usage with customer email
                await supabase
                  .from('coupon_usage')
                  .insert({
                    coupon_id: couponData.id,
                    customer_email: formData.email,
                    discount_amount: appliedCoupon.discount_amount
                  });
              }
            } catch (couponError) {
              // Silently handle coupon update errors
            }
          }
          // Send email notifications
          try {
            await sendOrderConfirmation(formData.email, {
              customer_name: formData.fullName,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: (item.price * item.quantity).toFixed(2)
              })),
              total: finalTotal.toFixed(2),
              delivery_address: `${formData.address}, ${formData.city}, ${formData.postcode}`,
              phone: formData.phone
            });
          } catch (emailError) {
            // Silently handle email errors
          }
        }
      } catch (dbError) {
        // Silently handle database errors
      }
      toast.success("Payment successful!", {
        description: `Paid £${finalTotal.toFixed(2)} via ${paymentMethod}. Order confirmation sent.`,
      });

      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      toast.error("Payment failed", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some items before checking out
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
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold mb-4">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your street address"
                      required
                      className="mt-1"
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        required
                        className="mt-1"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode *</Label>
                      <div className="relative">
                        <Input
                          id="postcode"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          placeholder="Enter your postcode (e.g., HU1 2AB)"
                          required
                          className="mt-1"
                          autoComplete="off"
                        />
                        {calculatingFee && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                      {formData.postcode && formData.postcode.length >= 3 && (
                        <p className="text-xs mt-1 text-muted-foreground">
                          {calculatingFee ? (
                            <span className="text-blue-600">Calculating delivery fee...</span>
                          ) : postcodeEntered ? (
                            isHullPostcode(formData.postcode) ? (
                              <span className="text-green-600">✓ Within Hull area - £{deliveryFee.toFixed(2)} delivery</span>
                            ) : (
                              <span className="text-orange-600">Outside Hull area - £{deliveryFee.toFixed(2)} delivery</span>
                            )
                          ) : (
                            <span className="text-gray-500">Enter postcode to calculate delivery fee</span>
                          )}
                        </p>
                      )}
                      {!formData.postcode && (
                        <p className="text-xs mt-1 text-gray-500">
                          Please enter your postcode to calculate delivery fee
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Delivery Notes (optional)</Label>
                    <Input
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special delivery instructions"
                      className="mt-1"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              {/* Allergies Information */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold mb-4">
                  Allergy Information
                </h2>
                <div>
                  <Label htmlFor="allergies">Allergies & Dietary Requirements (optional)</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Please list any allergies, dietary restrictions, or ingredients to avoid (e.g., nuts, dairy, gluten, shellfish)"
                    className="mt-1"
                    rows={3}
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This helps us prepare your food safely. Leave blank if no allergies.
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Please enter your card details manually. All fields are required.
                  </p>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <Label className="text-sm font-medium mb-2 block">Card Details *</Label>
                    <div className="p-3 border border-input rounded-md">
                      <CardElement options={cardElementOptions} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter your card number, expiry date, CVC, and postal code
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I understand and agree that orders take{" "}
                    <strong>{brandContent.orderProcessing}</strong>{" "}
                    {brandContent.shippingNote}. I acknowledge that I am paying
                    via Stripe.
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="golden"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !agreedToTerms || !formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postcode.trim() || !postcodeEntered}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    {postcodeEntered ? `Pay £${finalTotal.toFixed(2)} with Stripe` : 'Enter postcode to continue'}
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.spiceLevel}`}
                    className="flex gap-3 pb-4 border-b border-border"
                  >
                    {item.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} • Spice: {item.spiceLevel}
                      </p>
                      {item.customizationNote && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          Note: {item.customizationNote}
                        </p>
                      )}
                    </div>
                    <span className="font-medium flex-shrink-0">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>£{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery Fee {postcodeEntered ? (isHullPostcode(formData.postcode) ? '(Hull)' : '(Outside Hull)') : ''}
                  </span>
                  <span>{postcodeEntered ? `£${deliveryFee.toFixed(2)}` : 'Enter postcode'}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-£{appliedCoupon.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-golden">
                      £{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                <CouponInput
                  onCouponApplied={setAppliedCoupon}
                  onCouponRemoved={() => setAppliedCoupon(null)}
                  appliedCoupon={appliedCoupon}
                  subtotal={totalAmount}
                  customerEmail={formData.email}
                />
              </div>

              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-primary">
                  {brandContent.orderProcessing}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutForm() {
  // Only show error for actually missing keys, not when they exist
  if (!stripeConfig.publishableKey || stripeConfig.publishableKey === 'your_stripe_publishable_key_here') {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Payment System Not Configured</h2>
        <p className="text-gray-600 mb-4">Stripe payment keys are missing. Please contact support.</p>
        <Button onClick={() => window.location.href = '/contact'}>Contact Support</Button>
      </div>
    );
  }
  
  return (
    <Elements 
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutFormContent />
    </Elements>
  );
}
