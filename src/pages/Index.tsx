
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Features from "@/components/home/Features";
import QRScanner from "@/components/QRScanner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProducts = async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setFeaturedProducts(products.filter(p => p.is_featured));
      setTrendingProducts(products.filter(p => p.is_trending));
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
      <Features />
    </Layout>
  );
};

export default Index;
