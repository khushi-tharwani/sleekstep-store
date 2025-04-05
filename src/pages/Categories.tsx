
import React, { useEffect, useState } from 'react';
import Layout from "@/components/layout/Layout";
import { supabase } from '@/integrations/supabase/client';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Link } from 'react-router-dom';

type Category = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  product_count: number;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch categories from Supabase
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        // If no categories in database, use sample data
        if (!data || data.length === 0) {
          const sampleCategories: Category[] = [
            {
              id: "running",
              name: "Running",
              description: "High-performance shoes designed for runners of all levels",
              image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
              product_count: 24
            },
            {
              id: "casual",
              name: "Casual",
              description: "Everyday comfort for work and leisure",
              image_url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
              product_count: 18
            },
            {
              id: "basketball",
              name: "Basketball",
              description: "Engineered for court performance and ankle support",
              image_url: "https://images.unsplash.com/photo-1579338559194-a162d19bf842",
              product_count: 12
            },
            {
              id: "training",
              name: "Training",
              description: "Versatile shoes for gym workouts and cross-training",
              image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
              product_count: 15
            },
            {
              id: "outdoor",
              name: "Outdoor",
              description: "Durable footwear for trails and outdoor activities",
              image_url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
              product_count: 20
            },
            {
              id: "fashion",
              name: "Fashion",
              description: "Trendy styles to complement your wardrobe",
              image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
              product_count: 22
            }
          ];
          setCategories(sampleCategories);
        } else {
          setCategories(data as Category[]);
        }
      } catch (error) {
        console.error('Error in fetchCategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-200 rounded-lg aspect-square"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-lg aspect-square hover:shadow-xl transition-all duration-300"
                >
                  {/* Background image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${category.image_url}')` }}
                  ></div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6 z-10">
                    <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{category.description}</p>
                    <span className="text-sm text-gray-300">{category.product_count} Products</span>
                  </div>
                </Link>
              ))}
            </div>
            
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
