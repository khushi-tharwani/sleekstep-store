
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Star, Truck, RotateCcw, QrCode } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateProductQRCode } from "@/utils/qr-generator";
import { QRCodeSVG } from 'qrcode.react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch product from Supabase
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_sizes(*),
            product_colors(*),
            reviews(*)
          `)
          .eq('id', id)
          .single();
        
        if (error || !data) {
          toast({
            title: 'Product Not Found',
            description: 'Sorry, the product you are looking for does not exist.',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }

        // Generate QR Code if not exists
        if (!data.qr_code) {
          const qrCode = await generateProductQRCode(data.id);
          if (qrCode) {
            data.qr_code = qrCode;
          }
        }

        // Transform Supabase data to match our Product interface
        const transformedProduct: Product = {
          id: data.id,
          name: data.name,
          brand: data.brand,
          category: data.category,
          price: data.price,
          salePrice: data.sale_price,
          description: data.description,
          images: data.images,
          sizes: data.product_sizes,
          colors: data.product_colors,
          stock: data.stock,
          rating: data.rating || 0,
          reviews: data.reviews || [],
          isFeatured: data.is_featured || false,
          isTrending: data.is_trending || false,
          createdAt: data.created_at
        };
        
        setProduct(transformedProduct);
        setSelectedImage(transformedProduct.images[0]);
        
        // Set default selections
        const availableSize = transformedProduct.sizes.find(s => s.available);
        if (availableSize) {
          setSelectedSize(availableSize.value);
        }
        
        const availableColor = transformedProduct.colors.find(c => c.available);
        if (availableColor) {
          setSelectedColor(availableColor.value);
        }
        
        // Fetch related products
        try {
          const { data: related } = await supabase
            .from('products')
            .select('*, product_sizes(*), product_colors(*), reviews(*)')
            .eq('category', transformedProduct.category)
            .neq('id', transformedProduct.id)
            .limit(3);
          
          if (related) {
            // Transform related products data
            const transformedRelated = related.map((item: any) => ({
              id: item.id,
              name: item.name,
              brand: item.brand,
              category: item.category,
              price: item.price,
              salePrice: item.sale_price,
              description: item.description,
              images: item.images,
              sizes: item.product_sizes,
              colors: item.product_colors,
              stock: item.stock,
              rating: item.rating || 0,
              reviews: item.reviews || [],
              isFeatured: item.is_featured || false,
              isTrending: item.is_trending || false,
              createdAt: item.created_at
            }));
            
            setRelatedProducts(transformedRelated);
          }
        } catch (relatedError) {
          console.error("Error fetching related products:", relatedError);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: 'Error',
          description: 'Failed to load product details.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "You must select a size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast({
        title: "Maximum stock reached",
        description: "You've reached the maximum available stock for this item.",
        variant: "destructive",
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-6xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <div className="aspect-square bg-dark-200 rounded-lg"></div>
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square w-24 bg-dark-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-8 bg-dark-200 rounded w-3/4"></div>
                <div className="h-6 bg-dark-200 rounded w-1/3"></div>
                <div className="h-6 bg-dark-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-4 bg-dark-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-dark-200 rounded w-full md:w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">Sorry, the product you're looking for does not exist.</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* QR Code Modal */}
        {showQRCode && product && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowQRCode(false)}>
            <div className="bg-white p-6 rounded-lg" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Product QR Code</h3>
              <QRCodeSVG value={`https://shoemania.com/product/${product.id}`} size={256} />
              <p className="mt-4 text-center text-gray-600">Scan to view product details</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square overflow-hidden rounded-lg bg-dark-100 mb-4">
              <img 
                src={selectedImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square w-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === image ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <div className="mb-1">
              <Link to={`/products?brand=${product.brand}`} className="text-primary hover:underline">
                {product.brand}
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < Math.round(product.rating)
                        ? "fill-gold text-gold"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {product.rating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
            
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">${product.salePrice.toFixed(2)}</span>
                  <span className="text-lg text-destructive line-through">${product.price.toFixed(2)}</span>
                  <span className="ml-2 px-2 py-1 text-xs bg-destructive text-white rounded">
                    Save ${(product.price - product.salePrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">{product.description}</p>
            </div>
            
            {/* Size selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                      selectedSize === size.value
                        ? "bg-primary text-white border-primary"
                        : "border-white/20 hover:border-white/50"
                    } ${!size.available ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => size.available && setSelectedSize(size.value)}
                    disabled={!size.available}
                  >
                    {size.value}
                    {!size.available && " - Out of Stock"}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.value
                        ? "border-primary shadow-md"
                        : "border-white/20"
                    } ${!color.available ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => color.available && setSelectedColor(color.value)}
                    disabled={!color.available}
                    title={color.name}
                  ></button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-l-md hover:bg-dark-200"
                >
                  -
                </button>
                <div className="w-14 h-10 flex items-center justify-center border-t border-b border-white/20">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-r-md hover:bg-dark-200"
                >
                  +
                </button>
                <span className="ml-4 text-sm text-gray-400">
                  {product.stock} available
                </span>
              </div>
            </div>
            
            {/* Add to cart and wishlist */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 hover:bg-dark-200"
                onClick={() => setShowQRCode(true)}
              >
                <QrCode className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-dark-200">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Additional info */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">30-day returns policy</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product details tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3 bg-dark-100">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li><span className="font-medium">Brand:</span> {product.brand}</li>
                    <li><span className="font-medium">Category:</span> {product.category}</li>
                    <li><span className="font-medium">Available Sizes:</span> {product.sizes.filter(s => s.available).map(s => s.value).join(", ")}</li>
                    <li><span className="font-medium">Available Colors:</span> {product.colors.filter(c => c.available).map(c => c.name).join(", ")}</li>
                    <li><span className="font-medium">Stock:</span> {product.stock} units</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>Clean with a soft, dry cloth</li>
                    <li>Avoid direct exposure to sunlight</li>
                    <li>Store in a cool, dry place</li>
                    <li>Do not machine wash</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-6">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{review.userName}</h4>
                        <span className="text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? "fill-gold text-gold"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="block"
                >
                  <div className="bg-dark-100 border border-white/5 rounded-lg overflow-hidden hover-card">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedProduct.images[0]} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{relatedProduct.name}</h3>
                      <p className="text-sm text-gray-400">{relatedProduct.brand}</p>
                      <div className="mt-2">
                        {relatedProduct.salePrice ? (
                          <div className="flex items-center">
                            <span className="font-bold mr-2">${relatedProduct.salePrice.toFixed(2)}</span>
                            <span className="text-destructive line-through text-sm">${relatedProduct.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-bold">${relatedProduct.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
