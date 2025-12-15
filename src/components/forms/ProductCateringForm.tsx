import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Calendar, Users, MapPin, Send } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCateringFormProps {
  product: Product;
}

export function ProductCateringForm({ product }: ProductCateringFormProps) {
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    event_date: '',
    event_time: '',
    event_location: '',
    number_of_guests: '',
    requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('catering_requests').insert({
        ...formData,
        product_id: product.id,
        product_name: product.name,
        number_of_guests: parseInt(formData.number_of_guests) || 0,
        status: 'pending'
      });

      if (error) throw error;

      toast.success(`Catering request for ${product.name} submitted successfully!`);
      setFormData({
        requester_name: '',
        requester_email: '',
        requester_phone: '',
        event_date: '',
        event_time: '',
        event_location: '',
        number_of_guests: '',
        requirements: '',
      });
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-elevated">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'} 
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <CardTitle className="font-display text-2xl md:text-3xl">
                    Book <span className="text-gradient-wine">{product.name}</span>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Request catering for this specific dish
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Contact Details
                    </h3>
                    
                    <div>
                      <Label htmlFor={`name-${product.id}`}>Full Name *</Label>
                      <Input
                        id={`name-${product.id}`}
                        name="requester_name"
                        value={formData.requester_name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`email-${product.id}`}>Email *</Label>
                      <Input
                        id={`email-${product.id}`}
                        name="requester_email"
                        type="email"
                        value={formData.requester_email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`phone-${product.id}`}>Phone Number *</Label>
                      <Input
                        id={`phone-${product.id}`}
                        name="requester_phone"
                        type="tel"
                        value={formData.requester_phone}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Event Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Event Details
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`date-${product.id}`}>Event Date</Label>
                        <Input
                          id={`date-${product.id}`}
                          name="event_date"
                          type="date"
                          value={formData.event_date}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`time-${product.id}`}>Event Time</Label>
                        <Input
                          id={`time-${product.id}`}
                          name="event_time"
                          type="time"
                          value={formData.event_time}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`guests-${product.id}`}>Number of Guests *</Label>
                      <Input
                        id={`guests-${product.id}`}
                        name="number_of_guests"
                        type="number"
                        min="1"
                        value={formData.number_of_guests}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`location-${product.id}`}>Event Location *</Label>
                      <Input
                        id={`location-${product.id}`}
                        name="event_location"
                        value={formData.event_location}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        placeholder="Full address or venue name"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <Label htmlFor={`requirements-${product.id}`}>
                    Special Requirements for {product.name}
                  </Label>
                  <Textarea
                    id={`requirements-${product.id}`}
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1"
                    placeholder={`Any specific requests for ${product.name} preparation, dietary requirements, or additional services...`}
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8"
                  >
                    {isSubmitting ? (
                      'Submitting Request...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Request {product.name} Catering
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}