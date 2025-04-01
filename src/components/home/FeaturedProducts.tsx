
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
  title: string;
  description?: string;
}

const FeaturedProducts = ({ products, title, description }: FeaturedProductsProps) => {
  const { addToCart } = useCart();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  
  const handleAddToCart = (product: Product) => {
    // Default size and color for quick add
    const defaultSize = product.sizes.find(size => size.available)?.value || product.sizes[0].value;
    const defaultColor = product.colors.find(color => color.available)?.value || product.colors[0].value;
    addToCart(product, 1, defaultSize, defaultColor);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="bg-dark-100 border-white/5 overflow-hidden hover-card"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.salePrice && (
                    <span className="absolute top-2 left-2 bg-destructive text-white text-xs px-2 py-1 rounded">
                      Sale
                    </span>
                  )}
                  <button className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-white" />
                  </button>
                </Link>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-lg hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-400">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    {product.salePrice ? (
                      <div>
                        <span className="text-destructive line-through text-sm mr-2">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="font-semibold">${product.salePrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(product.rating) 
                              ? "text-gold" 
                              : "text-gray-400"
                          }`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-1">
                      ({product.reviews.length})
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
