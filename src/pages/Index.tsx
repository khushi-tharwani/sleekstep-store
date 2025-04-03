import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Features from "@/components/home/Features";
import QRScanner from "@/components/QRScanner";
import WeatherShoeRecommendations from '@/components/WeatherShoeRecommendations';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProducts = async () => {
      try {
        const { data: products, error } = await supabase
          .from('products')
          .select('*, product_sizes(*), product_colors(*), reviews(*)');
        
        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        if (products) {
          // Transform Supabase data to match our Product interface
          const transformedProducts = products.map((product: any) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            salePrice: product.sale_price,
            description: product.description,
            images: product.images,
            sizes: product.product_sizes,
            colors: product.product_colors,
            stock: product.stock,
            rating: product.rating,
            reviews: product.reviews,
            isFeatured: product.is_featured,
            isTrending: product.is_trending,
            createdAt: product.created_at
          }));

          setFeaturedProducts(transformedProducts.filter(p => p.isFeatured));
          setTrendingProducts(transformedProducts.filter(p => p.isTrending));
        }
      } catch (error) {
        console.error('Error in fetchProducts:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <Hero />
      <QRScanner />
      <FeaturedProducts 
        products={featuredProducts} 
        title="Featured Products"
        description="Our handpicked selection of premium footwear"
      />
      <Categories />
      <FeaturedProducts 
        products={trendingProducts}
        title="Trending Now" 
        description="The latest styles our customers love"
      />
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Recommended For You</h2>
        <WeatherShoeRecommendations />
      </section>
      <Features />
    </Layout>
  );
};

export default Index;
