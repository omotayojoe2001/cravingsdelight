import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from './ImageUpload';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_active: boolean;
  available_for_catering?: boolean;
}

interface ProductEditModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ProductEditModal({ product, open, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'rice',
    image: '',
    is_active: true,
    available_for_catering: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        image: product.image,
        is_active: product.is_active,
        available_for_catering: product.available_for_catering || false,
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'rice',
        image: '',
        is_active: true,
        available_for_catering: false,
      });
    }
  }, [product, open]);

  const handleSave = async () => {
    console.log('Saving product...', formData);
    setSaving(true);
    
    let error;
    if (product) {
      // Update existing product
      console.log('Updating product:', product.id);
      const { error: updateError } = await supabase
        .from('products')
        .update(formData)
        .eq('id', product.id);
      error = updateError;
    } else {
      // Create new product
      console.log('Creating new product');
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(formData)
        .select();
      error = insertError;
      console.log('Insert result:', { data, error });
    }

    if (error) {
      console.error('❌ PRODUCT SAVE FAILED:', error);
      toast.error((product ? 'Failed to update product: ' : 'Failed to create product: ') + error.message);
    } else {
      console.log('✅ PRODUCT SAVED');
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
      onSave();
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice Dishes</SelectItem>
                    <SelectItem value="proteins">Proteins</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="soup">Soups</SelectItem>
                    <SelectItem value="sides">Sides</SelectItem>
                    <SelectItem value="appetizers">Appetizers</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="seafood">Seafood</SelectItem>
                    <SelectItem value="pasta">Pasta</SelectItem>
                    <SelectItem value="salads">Salads</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="special">Specials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Active on website</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Available for catering</Label>
              <Switch
                checked={formData.available_for_catering}
                onCheckedChange={(checked) => setFormData({ ...formData, available_for_catering: checked })}
              />
            </div>
          </div>

          <div>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}