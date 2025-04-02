
import { useState, useEffect } from "react";
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
import { generateProductQRCode } from "@/utils/qr-generator";
import { toast } from "@/components/ui/use-toast";
import QRScanner from "@/components/QRScanner";
import GyroscopeViewer from "@/components/product/GyroscopeViewer";
import { Scanner } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [useGyroscope, setUseGyroscope] = useState(false);
  const { addToCart } = useCart();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        // Fetch product data
        const { data: productData, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (productData) {
          // Fetch sizes
          const { data: sizesData } = await supabase
            .from("product_sizes")
            .select("*")
            .eq("product_id", id);

          // Fetch colors
          const { data: colorsData } = await supabase
            .from("product_colors")
            .select("*")
            .eq("product_id", id);

          // Fetch reviews
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", id);

          // Transform to match Product interface
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

          // Set initial selections
          const availableSize = product.sizes.find((size) => size.available);
          const availableColor = product.colors.find((color) => color.available);
          
          if (availableSize) setSelectedSize(availableSize.value);
          if (availableColor) setSelectedColor(availableColor.value);

          if (productData.qr_code) {
            setQrCodeUrl(productData.qr_code);
          }
          
          return product;
        }
        
        // If no product found in database, try mock data
        return mockProducts.find((p) => p.id === id) || null;
      } catch (error) {
        console.error("Error fetching product:", error);
        // Try to find the product in our mock data as fallback
        return mockProducts.find((p) => p.id === id) || null;
      }
    },
  });

  const handleGenerateQRCode = async () => {
    if (!product) return;
    
    try {
      const qrCode = await generateProductQRCode(product.id);
      if (qrCode) {
        setQrCodeUrl(qrCode);
        toast({
          title: "QR Code Generated",
          description: "QR Code has been generated for this product",
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
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
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Scan Product QR Code</h2>
            <QRScanner />
            <Button 
              onClick={() => setShowQRScanner(false)}
              className="mt-4"
              variant="outline"
            >
              Close Scanner
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {useGyroscope ? (
              <GyroscopeViewer images={product.images} />
            ) : (
              <>
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary"
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setUseGyroscope(!useGyroscope)} 
                variant="outline" 
                className="flex-1"
              >
                {useGyroscope ? "Standard View" : "Gyroscope View"}
              </Button>
              <Button 
                onClick={() => setShowQRScanner(true)} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Scanner className="h-4 w-4" />
                Scan QR
              </Button>
            </div>
            
            {/* QR Code Display */}
            {showQRCode && qrCodeUrl && (
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Product QR Code</h3>
                <div className="flex justify-center">
                  <img src={qrCodeUrl} alt="Product QR Code" className="w-40 h-40" />
                </div>
              </div>
            )}
            
            {!qrCodeUrl && (
              <Button onClick={handleGenerateQRCode} variant="outline">
                Generate QR Code
              </Button>
            )}
            
            {qrCodeUrl && !showQRCode && (
              <Button onClick={() => setShowQRCode(true)} variant="outline">
                Show QR Code
              </Button>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-lg text-gray-400 mt-1">{product.brand}</p>
            </div>
            
            <div>
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    SALE
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-400">{product.description}</p>
            </div>
            
            <ProductOptions
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              quantity={quantity}
              setQuantity={setQuantity}
            />
            
            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-medium mb-4">Reviews ({product.reviews.length})</h3>
              
              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg bg-dark-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-gold" : "text-gray-400"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">This product has no reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
