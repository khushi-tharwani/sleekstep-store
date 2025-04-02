
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

export const generateProductQRCode = async (productId: string) => {
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

export const fetchProductByQRCode = async (scannedUrl: string) => {
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
    
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
