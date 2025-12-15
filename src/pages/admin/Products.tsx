import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ProductEditModal } from '@/components/admin/ProductEditModal';
import { toast } from 'sonner';
import { Plus, Search, Edit } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  available_for_catering: boolean;
  image: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) setProducts(data);
  }

  function filterProducts() {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }

  async function toggleActive(id: string, is_active: boolean) {
    const { error } = await supabase.from('products').update({ is_active: !is_active }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success('Product updated');
      fetchProducts();
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? filteredProducts.map(p => p.id) : []);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Delete ${selectedProducts.length} selected products?`)) return;
    
    setDeleting(true);
    const { error } = await supabase.from('products').delete().in('id', selectedProducts);
    
    if (error) {
      toast.error('Failed to delete products');
    } else {
      toast.success(`${selectedProducts.length} products deleted`);
      setSelectedProducts([]);
      fetchProducts();
    }
    setDeleting(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">{filteredProducts.length} of {products.length} products</p>
          </div>
          <div className="flex gap-3">
            {selectedProducts.length > 0 && (
              <Button 
                onClick={handleBulkDelete} 
                variant="destructive" 
                size="sm"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : `Delete ${selectedProducts.length}`}
              </Button>
            )}
            <Button onClick={() => {
              setEditingProduct(null);
              setAddModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="rice">Rice Dishes</SelectItem>
                <SelectItem value="soup">Soups</SelectItem>
                <SelectItem value="sides">Sides</SelectItem>
                <SelectItem value="special">Specials</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{filteredProducts.filter(p => p.is_active).length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-500">{filteredProducts.filter(p => !p.is_active).length}</div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table - Google Sheets Style */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Catering</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-bold">£{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={() => toggleActive(product.id, product.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      {product.available_for_catering ? (
                        <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setModalOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <ProductEditModal
          product={editingProduct}
          open={modalOpen || addModalOpen}
          onClose={() => {
            setModalOpen(false);
            setAddModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            fetchProducts();
          }}
        />
      </div>
    </AdminLayout>
  );
}