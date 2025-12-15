import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Calendar, Users, MapPin, Send, Plus, Minus, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
  size: string;
  notes: string;
}

export function ComprehensiveCateringForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    event_date: '',
    event_time: '',
    event_location: '',
    event_type: '',
    total_estimated_guests: '',
    budget_range: '',
    additional_services: '',
    requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCateringProducts();
  }, []);

  async function fetchCateringProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('available_for_catering', true)
      .order('category', { ascending: true });
    if (data) setProducts(data);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addProduct = (product: Product) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(prev => 
        prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
      );
    } else {
      setSelectedProducts(prev => [...prev, {
        id: product.id,
        name: product.name,
        quantity: 1,
        size: 'medium',
        notes: ''
      }]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, quantity } : p)
    );
  };

  const updateProductSize = (productId: string, size: string) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, size } : p)
    );
  };

  const updateProductNotes = (productId: string, notes: string) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, notes } : p)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product for catering');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('catering_requests').insert({
        ...formData,
        total_estimated_guests: parseInt(formData.total_estimated_guests) || 0,
        selected_products: JSON.stringify(selectedProducts),
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Comprehensive catering request submitted successfully!');
      setFormData({
        requester_name: '',
        requester_email: '',
        requester_phone: '',
        event_date: '',
        event_time: '',
        event_location: '',
        event_type: '',
        total_estimated_guests: '',
        budget_range: '',
        additional_services: '',
        requirements: '',
      });
      setSelectedProducts([]);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Card className="shadow-elevated">
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-display text-3xl md:text-4xl">
                <ShoppingCart className="inline-block mr-3 h-8 w-8" />
                Complete <span className="text-gradient-wine">Catering</span> Booking
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Select multiple dishes, specify quantities and sizes for your event
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Selection */}
                <div>
                  <h3 className="font-semibold text-xl mb-4">Select Your Menu Items</h3>
                  
                  {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                    <div key={category} className="mb-6">
                      <h4 className="font-medium text-lg mb-3 capitalize text-primary">{category} Dishes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryProducts.map((product) => (
                          <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'} 
                                alt={product.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{product.name}</h5>
                                <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => addProduct(product)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-xl mb-4">Your Selected Items ({selectedProducts.length})</h3>
                    <div className="space-y-3">
                      {selectedProducts.map((item) => (
                        <div key={item.id} className="bg-card border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div>
                              <h5 className="font-medium">{item.name}</h5>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => updateProductQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => updateProductQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Select value={item.size} onValueChange={(value) => updateProductSize(item.id, value)}>
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small Portion</SelectItem>
                                <SelectItem value="medium">Medium Portion</SelectItem>
                                <SelectItem value="large">Large Portion</SelectItem>
                                <SelectItem value="family">Family Size</SelectItem>
                                <SelectItem value="bulk">Bulk/Party Size</SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Special notes..."
                              value={item.notes}
                              onChange={(e) => updateProductNotes(item.id, e.target.value)}
                              className="h-8 text-sm"
                            />

                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeProduct(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact & Event Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Contact Information
                    </h3>
                    
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="requester_name"
                        value={formData.requester_name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="requester_email"
                        type="email"
                        value={formData.requester_email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="requester_phone"
                        type="tel"
                        value={formData.requester_phone}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Event Information
                    </h3>

                    <div>
                      <Label htmlFor="event_type">Event Type</Label>
                      <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="birthday">Birthday Party</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="graduation">Graduation</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                          <SelectItem value="funeral">Funeral/Memorial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="event_date">Event Date</Label>
                        <Input
                          id="event_date"
                          name="event_date"
                          type="date"
                          value={formData.event_date}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_time">Event Time</Label>
                        <Input
                          id="event_time"
                          name="event_time"
                          type="time"
                          value={formData.event_time}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="total_estimated_guests">Total Guests *</Label>
                      <Input
                        id="total_estimated_guests"
                        name="total_estimated_guests"
                        type="number"
                        min="1"
                        value={formData.total_estimated_guests}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget_range">Budget Range</Label>
                      <Select value={formData.budget_range} onValueChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-500">Under £500</SelectItem>
                          <SelectItem value="500-1000">£500 - £1,000</SelectItem>
                          <SelectItem value="1000-2000">£1,000 - £2,000</SelectItem>
                          <SelectItem value="2000-5000">£2,000 - £5,000</SelectItem>
                          <SelectItem value="over-5000">Over £5,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location & Additional Services */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event_location">Event Location *</Label>
                    <Input
                      id="event_location"
                      name="event_location"
                      value={formData.event_location}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="Full address or venue name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional_services">Additional Services Needed</Label>
                    <Textarea
                      id="additional_services"
                      name="additional_services"
                      value={formData.additional_services}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1"
                      placeholder="e.g., Serving staff, tables, chairs, decorations, cleanup service..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Special Requirements & Dietary Restrictions</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1"
                      placeholder="Any allergies, dietary restrictions, special preparation requests, or other important details..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || selectedProducts.length === 0}
                    className="w-full md:w-auto px-12"
                  >
                    {isSubmitting ? (
                      'Submitting Request...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Catering Request ({selectedProducts.length} items)
                      </>
                    )}
                  </Button>
                  {selectedProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Please select at least one menu item to continue
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}