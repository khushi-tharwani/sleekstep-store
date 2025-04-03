
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product, Order } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  loading: boolean;
  checkoutCart: (paymentMethod: string, addressId: string) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      if (!user) return;

      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select('*, product:product_id(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      if (cartItems) {
        const transformedItems: CartItem[] = cartItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          product: {
            id: item.product.id,
            name: item.product.name,
            brand: item.product.brand,
            category: item.product.category,
            price: item.product.price,
            salePrice: item.product.sale_price,
            description: item.product.description,
            images: item.product.images || [],
            sizes: [],
            colors: [],
            stock: item.product.stock || 0,
            rating: item.product.rating || 0,
            reviews: [],
            isFeatured: item.product.is_featured || false,
            isTrending: item.product.is_trending || false,
            createdAt: item.product.created_at || '',
          },
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }));
        
        setCart(transformedItems);
      }
    } catch (error) {
      console.error('Error in loadCart:', error);
    }
  };

  const syncCart = async () => {
    if (!user) return;

    try {
      // First, remove existing cart items
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Then insert the new cart items
      if (cart.length > 0) {
        const cartToInsert = cart.map(item => ({
          id: item.id,
          user_id: user.id,
          product_id: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }));

        const { error: insertError } = await supabase
          .from('cart_items')
          .insert(cartToInsert);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error syncing cart with database:', error);
    }
  };

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCart(prevCart => {
      // Check if the product with same size and color already exists in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      const updatedCart = [...prevCart];
      
      if (existingItemIndex >= 0) {
        // Update quantity of the existing item
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item to cart
        updatedCart.push({
          id: nanoid(),
          productId: product.id,
          product,
          quantity,
          size,
          color,
        });
      }
      
      if (user) {
        setTimeout(() => syncCart(), 0); // Sync cart with database if user is logged in
      }
      
      toast.success(`${product.name} added to cart`);
      return updatedCart;
    });
  };

  const updateCartItem = (id: string, quantity: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      if (user) {
        setTimeout(() => syncCart(), 0);
      }
      
      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === id);
      const updatedCart = prevCart.filter(item => item.id !== id);
      
      if (user) {
        setTimeout(() => syncCart(), 0);
      }
      
      if (itemToRemove) {
        toast.info(`${itemToRemove.product.name} removed from cart`);
      }
      
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      setTimeout(() => syncCart(), 0);
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const checkoutCart = async (paymentMethod: string, addressId: string): Promise<boolean> => {
    if (!user || cart.length === 0) {
      toast.error("Cart is empty or you're not logged in");
      return false;
    }

    setLoading(true);

    try {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: cartTotal,
          status: 'processing' as const,  // Using as const to ensure it matches the type
          payment_method: paymentMethod,
          address_id: addressId
        })
        .select('id')
        .single();

      if (orderError || !orderData) {
        throw orderError || new Error('Failed to create order');
      }

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
        size: item.size,
        color: item.color
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Clear the cart after successful order
      clearCart();
      
      // Navigate to success page
      navigate('/payment-success', { state: { orderId: orderData.id } });
      return true;
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error("Failed to complete your order");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Ensure all orders have the correct status type
        const typedOrders = data.map(order => ({
          ...order,
          status: order.status as 'processing' | 'shipped' | 'delivered' | 'cancelled'
        }));
        
        setOrders(typedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      loading,
      checkoutCart,
      fetchOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
