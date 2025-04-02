import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductSize, ProductColor, Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, Plus } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Form state for new/edit product
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Check if user is authenticated and admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return;
    }

    fetchProducts();
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch products from database
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;

      if (!productsData) {
        setProducts([]);
        return;
      }

      // Fetch the related data for each product
      const productsWithRelations = await Promise.all(productsData.map(async (product) => {
        // Fetch sizes for this product
        const { data: sizesData } = await supabase
          .from('product_sizes')
          .select('*')
          .eq('product_id', product.id);
        
        // Fetch colors for this product
        const { data: colorsData } = await supabase
          .from('product_colors')
          .select('*')
          .eq('product_id', product.id);
        
        // Fetch reviews for this product
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', product.id);
        
        // Transform database objects to match our interfaces
        const sizes: ProductSize[] = (sizesData || []).map(size => ({
          id: size.id,
          value: size.value,
          available: size.available || false
        }));

        const colors: ProductColor[] = (colorsData || []).map(color => ({
          id: color.id,
          name: color.name,
          value: color.value,
          available: color.available || false
        }));

        const reviews: Review[] = (reviewsData || []).map(review => ({
          id: review.id,
          userId: review.user_id || '',
          userName: review.user_name,
          rating: review.rating,
          comment: review.comment || '',
          createdAt: review.created_at || ''
        }));

        // Transform the product to match our Product interface
        return {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          salePrice: product.sale_price,
          description: product.description,
          images: product.images || [],
          sizes: sizes,
          colors: colors,
          stock: product.stock || 0,
          rating: product.rating || 0,
          reviews: reviews,
          isFeatured: product.is_featured || false,
          isTrending: product.is_trending || false,
          createdAt: product.created_at || ''
        } as Product;
      }));
      
      setProducts(productsWithRelations);
    } catch (error: any) {
      toast({
        title: "Failed to fetch products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add product to database
  const handleAddProduct = async () => {
    if (!name || !brand || !category || !price || !description || !stock) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, create the product
      const productImages = images.length > 0 ? images : [imageUrl];
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          brand,
          category,
          price: parseFloat(price),
          sale_price: salePrice ? parseFloat(salePrice) : null,
          description,
          stock: parseInt(stock),
          images: productImages,
          is_featured: false,
          is_trending: false
        })
        .select();
      
      if (productError) throw productError;
      
      if (productData && productData.length > 0) {
        const productId = productData[0].id;
        
        // Create default size
        await supabase.from('product_sizes').insert({
          product_id: productId,
          value: 'M',
          available: true
        });
        
        // Create default color
        await supabase.from('product_colors').insert({
          product_id: productId,
          name: 'Black',
          value: '#000000',
          available: true
        });
      }
      
      toast({
        title: "Product added",
        description: "Product has been added successfully.",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update product in database
  const handleUpdateProduct = async () => {
    if (!currentProduct?.id || !name || !brand || !category || !price || !description || !stock) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const productImages = images.length > 0 ? images : [imageUrl];
      const { error } = await supabase
        .from('products')
        .update({
          name,
          brand,
          category,
          price: parseFloat(price),
          sale_price: salePrice ? parseFloat(salePrice) : null,
          description,
          stock: parseInt(stock),
          images: productImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProduct.id);
      
      if (error) throw error;
      
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete product from database
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // Delete related sizes
      await supabase
        .from('product_sizes')
        .delete()
        .eq('product_id', id);
      
      // Delete related colors
      await supabase
        .from('product_colors')
        .delete()
        .eq('product_id', id);
      
      // Delete related reviews
      await supabase
        .from('reviews')
        .delete()
        .eq('product_id', id);
        
      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Set form values for editing
  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setPrice(product.price.toString());
    setSalePrice(product.salePrice ? product.salePrice.toString() : '');
    setDescription(product.description);
    setStock(product.stock.toString());
    setImages(product.images);
    setImageUrl(product.images[0] || '');
    setIsEditDialogOpen(true);
  };

  // Reset form values
  const resetForm = () => {
    setName('');
    setBrand('');
    setCategory('');
    setPrice('');
    setSalePrice('');
    setDescription('');
    setStock('');
    setImageUrl('');
    setImages([]);
    setCurrentProduct(null);
  };

  // Add image URL to images array
  const handleAddImage = () => {
    if (!imageUrl) return;
    setImages([...images, imageUrl]);
    setImageUrl('');
  };

  // Remove image from images array
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const productForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price (optional)</Label>
          <Input
            id="salePrice"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            type="number"
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock *</Label>
        <Input
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          type="number"
          placeholder="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddImage}>Add</Button>
        </div>
        
        {images.length > 0 && (
          <div className="mt-2 space-y-2">
            <Label>Current Images:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <img 
                    src={image} 
                    alt={`Product image ${index+1}`} 
                    className="w-12 h-12 object-cover rounded" 
                  />
                  <span className="flex-1 truncate text-sm">{image}</span>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <div className="bg-dark-100 rounded-lg border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded" 
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.salePrice ? (
                        <>
                          <span className="text-red-500">${product.salePrice}</span>
                          <span className="ml-2 line-through text-gray-500 text-xs">${product.price}</span>
                        </>
                      ) : (
                        `$${product.price}`
                      )}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No products found. Add your first product!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Brand name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (optional)</Label>
                  <Input
                    id="salePrice"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  type="number"
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddImage}>Add</Button>
                </div>
                
                {images.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Current Images:</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <img 
                            src={image} 
                            alt={`Product image ${index+1}`} 
                            className="w-12 h-12 object-cover rounded" 
                          />
                          <span className="flex-1 truncate text-sm">{image}</span>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of your product.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Brand name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (optional)</Label>
                  <Input
                    id="salePrice"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  type="number"
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddImage}>Add</Button>
                </div>
                
                {images.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Current Images:</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <img 
                            src={image} 
                            alt={`Product image ${index+1}`} 
                            className="w-12 h-12 object-cover rounded" 
                          />
                          <span className="flex-1 truncate text-sm">{image}</span>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminProducts;
