import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Search, Filter, QrCode, Compass } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { products as mockProducts } from '@/data/products';
import QRScanner from '@/components/QRScanner';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!productsData || productsData.length === 0) {
          console.log("No products found in Supabase, using mock data");
          
          const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
          setCategories(uniqueCategories);
          
          return mockProducts;
        }

        const productsWithRelations = await Promise.all(productsData.map(async (product) => {
          const { data: sizesData } = await supabase
            .from('product_sizes')
            .select('*')
            .eq('product_id', product.id);
          
          const { data: colorsData } = await supabase
            .from('product_colors')
            .select('*')
            .eq('product_id', product.id);
          
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', product.id);
          
          const sizes = (sizesData || []).map(size => ({
            id: size.id,
            value: size.value,
            available: size.available || false
          }));

          const colors = (colorsData || []).map(color => ({
            id: color.id,
            name: color.name,
            value: color.value,
            available: color.available || false
          }));

          const reviews = (reviewsData || []).map(review => ({
            id: review.id,
            userId: review.user_id || '',
            userName: review.user_name,
            rating: review.rating,
            comment: review.comment || '',
            createdAt: review.created_at || ''
          }));

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
        
        const uniqueCategories = [...new Set(productsWithRelations.map(p => p.category))];
        setCategories(uniqueCategories);
        
        return productsWithRelations;
      } catch (error) {
        console.error("Error fetching products:", error);
        const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        return mockProducts;
      }
    }
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-6">Shop All Products</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={() => setIsScanning(!isScanning)}
            className="md:w-auto flex items-center gap-2"
            variant="outline"
          >
            <QrCode className="h-4 w-4" />
            {isScanning ? "Close Scanner" : "Scan QR Code"}
          </Button>
        </div>
        
        {isScanning && (
          <div className="my-6">
            <QRScanner />
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative pt-[100%] bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  
                  {product.salePrice && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                  
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-1 rounded-full flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    <Compass className="h-3 w-3" />
                  </span>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  
                  <div className="flex items-center">
                    {product.salePrice ? (
                      <>
                        <span className="font-bold text-red-500">${product.salePrice}</span>
                        <span className="ml-2 text-gray-500 line-through text-sm">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">${product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
