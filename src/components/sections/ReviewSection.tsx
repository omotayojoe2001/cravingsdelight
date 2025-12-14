import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brandContent } from "@/data/menu";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";

export function ReviewSection() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reviewText: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to database
      const { supabase } = await import('@/lib/supabase');
      console.log('Submitting review...');
      const { data, error: dbError } = await supabase.from('reviews').insert({
        customer_name: formData.name || 'Anonymous',
        customer_email: formData.email || null,
        rating: rating || 5,
        review_text: formData.reviewText,
        is_approved: false
      }).select();

      if (dbError) {
        console.error('❌ REVIEW SAVE FAILED:', dbError);
        toast.error('Failed to save review: ' + dbError.message);
        return;
      } else {
        console.log('✅ REVIEW SAVED:', data);
      }

      toast.success("Thank you for your review!", {
        description: "Your review is pending approval and will appear soon.",
      });

      setRating(0);
      setFormData({ name: "", email: "", reviewText: "" });
    } catch (error) {
      toast.error("Submission failed", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
              Your Feedback
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Leave a <span className="text-gradient-wine">Review</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {brandContent.reviewPrompt}
            </p>
          </motion.div>

          {/* Review Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-background rounded-2xl p-6 md:p-10 shadow-soft"
          >
            {/* Star Rating */}
            <div className="mb-6">
              <Label className="mb-3 block">Your Rating (optional)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-golden text-golden"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-6">
              <Label htmlFor="reviewName">Your Name (optional)</Label>
              <Input
                id="reviewName"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                className="mt-2"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <Label htmlFor="reviewEmail">Your Email (optional)</Label>
              <Input
                id="reviewEmail"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="your@email.com"
                className="mt-2"
              />
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <Label htmlFor="reviewText">Your Review *</Label>
              <Textarea
                id="reviewText"
                value={formData.reviewText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewText: e.target.value,
                  }))
                }
                placeholder="Share your experience with us..."
                rows={5}
                required
                className="mt-2"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="wine"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </motion.form>
      </div>
    </div>
  );
}
