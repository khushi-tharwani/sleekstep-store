
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Features from "@/components/home/Features";
import { products } from "@/data/products";
import { useEffect } from "react";

const Index = () => {
  const featuredProducts = products.filter(product => product.isFeatured);
  const trendingProducts = products.filter(product => product.isTrending);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Hero />
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
