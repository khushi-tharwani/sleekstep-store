
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';
import { Product } from "@/types";
import { products as mockProducts } from "@/data/products";

export const generateProductQRCode = async (productId: string): Promise<string | null> => {
  try {
    // Generate a QR code data URL for the product
    console.log("Generating QR code for product ID:", productId);
    const qrCodeUrl = await QRCode.toDataURL(`https://shoemania.com/product/${productId}`);
    
    try {
      // Try to update the product in Supabase with the QR code
      const { error } = await supabase
        .from('products')
        .update({ qr_code: qrCodeUrl })
        .eq('id', productId);
      
      if (error) {
        console.warn('Could not update product in Supabase, but generated QR code:', error);
      }
    } catch (dbError) {
      console.warn('Database operation failed but QR code was generated:', dbError);
    }
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const fetchProductByQRCode = async (scannedInput: string): Promise<Product | null> => {
  try {
    console.log("Fetching product by ID or URL:", scannedInput);
    
    // Extract product ID if it's a URL or use as is
    const productId = scannedInput.includes('/product/') 
      ? scannedInput.split('/product/').pop() 
      : scannedInput;
      
    if (!productId) {
      throw new Error('Invalid QR code input');
    }
    
    // Try to fetch from Supabase first
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) {
        console.log("Supabase fetch error:", error);
        // If Supabase fails, fall back to mock data
        const mockProduct = mockProducts.find(p => p.id === productId);
        
        if (mockProduct) {
          console.log("Found product in mock data:", mockProduct.name);
          return mockProduct;
        }
        
        throw error;
      }
      
      // Transform the data to match our Product interface
      if (data) {
        console.log("Found product in Supabase:", data.name);
        const product: Product = {
          id: data.id,
          name: data.name,
          brand: data.brand,
          category: data.category,
          price: data.price,
          salePrice: data.sale_price,
          description: data.description,
          images: data.images || [],
          sizes: [],  // These would need to be fetched separately
          colors: [],  // These would need to be fetched separately
          stock: data.stock || 0,
          rating: data.rating || 0,
          reviews: [],  // These would need to be fetched separately
          isFeatured: data.is_featured || false,
          isTrending: data.is_trending || false,
          createdAt: data.created_at
        };
        
        return product;
      }
    } catch (dbError) {
      console.warn("Error fetching from database, trying mock data:", dbError);
    }
    
    // Fallback to mock data
    const mockProduct = mockProducts.find(p => p.id === productId);
    
    if (mockProduct) {
      console.log("Found product in mock data:", mockProduct.name);
      return mockProduct;
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchProductByQRCode:', error);
    return null;
  }
};
