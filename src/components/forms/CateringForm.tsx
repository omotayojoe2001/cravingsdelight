import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { brandContent } from "@/data/menu";
import { toast } from "sonner";
import { Send, Calendar, Users, MapPin, Mail, Phone, User } from "lucide-react";

export function CateringForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    numberOfGuests: "",
    requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to database
      const { supabase } = await import('@/lib/supabase');
      const { error: dbError } = await supabase.from('catering_requests').insert({
        requester_name: formData.name,
        requester_email: formData.email,
        requester_phone: formData.phone,
        event_date: formData.eventDate || null,
        event_time: formData.eventTime || null,
        event_location: formData.eventLocation,
        number_of_guests: parseInt(formData.numberOfGuests),
        requirements: formData.requirements
      });

      if (dbError) {
        console.error('Database error:', dbError);
      }

      toast.success("Catering request submitted!", {
        description: "We will review your request and send a response to your email shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        numberOfGuests: "",
        requirements: "",
      });
    } catch (error) {
      toast.error("Submission failed", {
        description: "Please try again or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
              Book Your Event
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Request <span className="text-gradient-wine">Catering</span>
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and we will get back to you with a custom
              quote for your event.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-background rounded-2xl p-6 md:p-10 shadow-soft"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                />
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <Label htmlFor="eventDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Event Date
                </Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                />
              </div>

              {/* Event Time */}
              <div className="space-y-2">
                <Label htmlFor="eventTime" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Event Time
                </Label>
                <Input
                  id="eventTime"
                  name="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={handleChange}
                />
              </div>

              {/* Event Location */}
              <div className="space-y-2">
                <Label
                  htmlFor="eventLocation"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Event Location *
                </Label>
                <Input
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  placeholder="Venue address"
                  required
                />
              </div>

              {/* Number of Guests */}
              <div className="space-y-2">
                <Label
                  htmlFor="numberOfGuests"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Number of Guests *
                </Label>
                <Input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  min="1"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  placeholder="Expected guests"
                  required
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="requirements">
                Event Requirements & Special Requests *
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Tell us everything about your event - type of dishes, dietary requirements, special requests, etc."
                rows={6}
                required
              />
            </div>

            {/* Submit */}
            <div className="mt-8">
              <Button
                type="submit"
                variant="wine"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Catering Request
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                We will send a confirmation email to your address and respond
                within 24-48 hours.
              </p>
            </div>
          </motion.form>

          {/* Contact Alternative */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-muted-foreground">
              Prefer to email directly? Contact us at{" "}
              <a
                href={`mailto:${brandContent.contactEmail}`}
                className="text-primary font-medium hover:underline"
              >
                {brandContent.contactEmail}
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
