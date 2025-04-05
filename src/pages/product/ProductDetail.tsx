import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import ProductOptions from "@/components/product/ProductOptions";
import { products as mockProducts } from "@/data/products";
import { toast } from "sonner";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import QRScannerSection from "@/components/product/QRScannerSection";
import QRCodeSection from "@/components/product/QRCodeSection";
import ProductHeader from "@/components/product/ProductHeader";
import ProductDescription from "@/components/product/ProductDescription";
import ReviewSection from "@/components/product/ReviewSection";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const { data: productData, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (productData) {
          const { data: sizesData } = await supabase
            .from("product_sizes")
            .select("*")
            .eq("product_id", id);

          const { data: colorsData } = await supabase
            .from("product_colors")
            .select("*")
            .eq("product_id", id);

          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", id);

          const product: Product = {
            id: productData.id,
            name: productData.name,
            brand: productData.brand,
            category: productData.category,
            price: productData.price,
            salePrice: productData.sale_price,
            description: productData.description,
            images: productData.images || [],
            sizes: sizesData?.map((size) => ({
              id: size.id,
              value: size.value,
              available: size.available,
            })) || [],
            colors: colorsData?.map((color) => ({
              id: color.id,
              name: color.name,
              value: color.value,
              available: color.available,
            })) || [],
            stock: productData.stock || 0,
            rating: productData.rating || 0,
            reviews: reviewsData?.map((review) => ({
              id: review.id,
              userId: review.user_id,
              userName: review.user_name,
              rating: review.rating,
              comment: review.comment,
              createdAt: review.created_at,
            })) || [],
            isFeatured: productData.is_featured || false,
            isTrending: productData.is_trending || false,
            createdAt: productData.created_at,
          };

          if (!selectedSize) {
            const availableSize = product.sizes.find((size) => size.available);
            if (availableSize) setSelectedSize(availableSize.value);
          }
          
          if (!selectedColor) {
            const availableColor = product.colors.find((color) => color.available);
            if (availableColor) setSelectedColor(availableColor.name);
          }

          if (productData.qr_code) {
            setQrCodeUrl(productData.qr_code);
          }
          
          return product;
        }
        
        const mockProduct = mockProducts.find((p) => p.id === id);
        if (mockProduct) {
          if (!selectedSize) {
            const availableSize = mockProduct.sizes.find((size) => size.available);
            if (availableSize) setSelectedSize(availableSize.value);
          }
          
          if (!selectedColor) {
            const availableColor = mockProduct.colors.find((color) => color.available);
            if (availableColor) setSelectedColor(availableColor.name);
          }
          
          return mockProduct;
        }
        
        return null;
      } catch (error) {
        console.error("Error fetching product:", error);
        const mockProduct = mockProducts.find((p) => p.id === id);
        if (mockProduct) {
          if (!selectedSize) {
            const availableSize = mockProduct.sizes.find((size) => size.available);
            if (availableSize) setSelectedSize(availableSize.value);
          }
          
          if (!selectedColor) {
            const availableColor = mockProduct.colors.find((color) => color.available);
            if (availableColor) setSelectedColor(availableColor.name);
          }
          
          return mockProduct;
        }
        return null;
      }
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast("Please select a size", {
        description: "You need to select a size before adding to cart", 
        position: "top-center"
      });
      return;
    }

    if (!selectedColor) {
      toast("Please select a color", {
        description: "You need to select a color before adding to cart",
        position: "top-center"
      });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    
    toast("Added to Cart", {
      description: `${product.name} has been added to your cart`,
      position: "top-center"
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-6">The product you are looking for does not exist.</p>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6">
        {showQRScanner && (
          <QRScannerSection onClose={() => setShowQRScanner(false)} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProductImageGallery 
              images={product.images} 
              onScannerToggle={() => setShowQRScanner(true)} 
            />
            
            <QRCodeSection 
              productId={product.id}
              qrCodeUrl={qrCodeUrl}
              showQRCode={showQRCode}
              setShowQRCode={setShowQRCode}
              setQrCodeUrl={setQrCodeUrl}
            />
          </div>
          
          <div className="space-y-6">
            <ProductHeader 
              name={product.name}
              brand={product.brand}
              price={product.price}
              salePrice={product.salePrice}
            />
            
            <ProductDescription description={product.description} />
            
            <ProductOptions
              product={product}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onQuantityChange={setQuantity}
              currentSize={selectedSize}
              currentColor={selectedColor}
              currentQuantity={quantity}
            />
            
            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            <ReviewSection reviews={product.reviews} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
