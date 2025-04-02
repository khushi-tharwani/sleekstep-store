
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';
import { Product } from "@/types";

export const generateProductQRCode = async (productId: string): Promise<string | null> => {
  try {
    // Generate a QR code data URL
    const qrCodeUrl = await QRCode.toDataURL(`https://shoemania.com/product/${productId}`);
    
    // Update the product in Supabase with the QR code
    const { error } = await supabase
      .from('products')
      .update({ qr_code: qrCodeUrl })
      .eq('id', productId);
    
    if (error) throw error;
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const fetchProductByQRCode = async (scannedUrl: string): Promise<Product | null> => {
  try {
    // Extract product ID from the URL
    const productId = scannedUrl.split('/').pop();
    
    if (!productId) {
      throw new Error('Invalid QR code URL');
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    
    // Transform the data to match our Product interface
    if (data) {
      const product: Product = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price,
        salePrice: data.sale_price,
        description: data.description,
        images: data.images,
        sizes: [],  // We'll need to fetch these separately or adjust the query
        colors: [],  // We'll need to fetch these separately or adjust the query
        stock: data.stock,
        rating: data.rating || 0,
        reviews: [],  // We'll need to fetch these separately or adjust the query
        isFeatured: data.is_featured || false,
        isTrending: data.is_trending || false,
        createdAt: data.created_at
      };
      
      return product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
