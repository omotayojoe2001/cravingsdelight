import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { sendCateringConfirmation } from '@/lib/email';
import { toast } from 'sonner';
import { Calendar, Users, MapPin, Send, Plus, Minus, ShoppingCart, Search, Filter } from 'lucide-react';

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

export function StreamlinedCateringForm() {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
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
    requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCateringProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter]);

  async function fetchCateringProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('available_for_catering', true)
      .order('name');
    if (data) setProducts(data);
  }

  function filterProducts() {
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }

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

  const updateProduct = (productId: string, field: string, value: any) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, [field]: value } : p)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('catering_requests').insert({
        requester_name: formData.requester_name,
        requester_email: formData.requester_email,
        requester_phone: formData.requester_phone,
        event_date: formData.event_date || null,
        event_time: formData.event_time || null,
        event_location: formData.event_location,
        number_of_guests: parseInt(formData.total_estimated_guests) || 0,
        requirements: `Event Type: ${formData.event_type || 'Not specified'}\nBudget: ${formData.budget_range || 'Not specified'}\n\nSelected Items:\n${selectedProducts.map(p => `- ${p.name} (${p.quantity}x ${p.size})${p.notes ? ` - ${p.notes}` : ''}`).join('\n')}\n\nSpecial Requirements:\n${formData.requirements || 'None'}`,
        status: 'pending'
      });

      if (error) throw error;

      // Send email notifications
      try {
        await sendCateringConfirmation(formData.requester_email, {
          requester_name: formData.requester_name,
          requester_phone: formData.requester_phone,
          event_date: formData.event_date,
          event_time: formData.event_time,
          event_location: formData.event_location,
          number_of_guests: formData.total_estimated_guests,
          requirements: formData.requirements
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      toast.success('Catering request submitted successfully!');
      setStep(1);
      setSelectedProducts([]);
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
        requirements: '',
      });
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

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
              <CardTitle className="font-display text-3xl md:text-4xl">
                <ShoppingCart className="inline-block mr-3 h-8 w-8" />
                Catering <span className="text-gradient-wine">Booking</span>
              </CardTitle>
              
              {/* Progress Steps */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {stepNum}
                      </div>
                      {stepNum < 3 && <div className={`w-12 h-0.5 ${step > stepNum ? 'bg-primary' : 'bg-muted'}`} />}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                {step === 1 && "Select Menu Items"}
                {step === 2 && "Review & Customize"}
                {step === 3 && "Event Details"}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Step 1: Product Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Search & Filter */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Items Summary */}
                  {selectedProducts.length > 0 && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Selected: {selectedProducts.length} items</span>
                        <Button onClick={() => setStep(2)} size="sm">
                          Review Selection →
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProducts.map(item => (
                          <Badge key={item.id} variant="secondary" className="text-xs">
                            {item.name} ({item.quantity})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => {
                      const selected = selectedProducts.find(p => p.id === product.id);
                      return (
                        <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'} 
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm truncate">{product.name}</h5>
                              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                              <Badge variant="outline" className="text-xs mt-1">{product.category}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {selected && (
                                <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded">
                                  {selected.quantity}
                                </span>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant={selected ? "default" : "outline"}
                                onClick={() => addProduct(product)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="text-center pt-4">
                      <Button onClick={() => setStep(2)} size="lg">
                        Continue with {selectedProducts.length} items →
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Review & Customize */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Review Your Selection</h3>
                    <Button variant="outline" onClick={() => setStep(1)}>
                      ← Add More Items
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedProducts.map((item) => (
                      <div key={item.id} className="bg-card border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <h5 className="font-medium">{item.name}</h5>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateProduct(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateProduct(item.id, 'quantity', item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Select value={item.size} onValueChange={(value) => updateProduct(item.id, 'size', value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="bulk">Bulk</SelectItem>
                            </SelectContent>
                          </Select>

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
                        
                        <div className="mt-3">
                          <Input
                            placeholder="Special notes for this item..."
                            value={item.notes}
                            onChange={(e) => updateProduct(item.id, 'notes', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <Button onClick={() => setStep(3)} size="lg" disabled={selectedProducts.length === 0}>
                      Continue to Event Details →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Event Details */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Event Information</h3>
                    <Button variant="outline" onClick={() => setStep(2)}>
                      ← Back to Review
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="requester_name"
                          value={formData.requester_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
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
                          onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="requester_phone"
                          type="tel"
                          value={formData.requester_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event_type">Event Type</Label>
                        <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday">Birthday</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="graduation">Graduation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="event_date">Date</Label>
                          <Input
                            id="event_date"
                            name="event_date"
                            type="date"
                            value={formData.event_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="event_time">Time</Label>
                          <Input
                            id="event_time"
                            name="event_time"
                            type="time"
                            value={formData.event_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="total_estimated_guests">Guests *</Label>
                        <Input
                          id="total_estimated_guests"
                          name="total_estimated_guests"
                          type="number"
                          min="1"
                          value={formData.total_estimated_guests}
                          onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="event_location">Location *</Label>
                    <Input
                      id="event_location"
                      name="event_location"
                      value={formData.event_location}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      required
                      className="mt-1"
                      placeholder="Event venue or address"
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

                  <div>
                    <Label htmlFor="requirements">Any Allergies and Special Requirements</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      rows={3}
                      className="mt-1"
                      placeholder="Please list any allergies, dietary restrictions, or special requirements..."
                    />
                  </div>

                  <div className="text-center pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-12"
                    >
                      {isSubmitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Catering Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}