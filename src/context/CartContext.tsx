
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
  
  // Aliases for components
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  subTotal: number;
  totalItems: number;
  fetchOrderHistory: () => Promise<Order[]>;
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

  // Load cart items using localStorage when not authenticated
  // or fetch from database when authenticated
  const loadCart = async () => {
    try {
      if (!user) {
        // Load from localStorage if available
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        return;
      }

      // For authenticated users, load from database
      // Since we don't have a cart_items table in the schema, we'll query order_items
      // and modify our approach
      
      // We'll use a temporary approach of storing cart items in localStorage even for logged-in users
      // since we don't have a dedicated cart_items table in the Supabase schema
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      
      // In a production app, you would create a cart_items table in Supabase
      // and fetch cart items from there
    } catch (error) {
      console.error('Error in loadCart:', error);
    }
  };

  // Save cart to localStorage and sync with database if authenticated
  const saveCart = (updatedCart: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
      // In a production app, you would sync with a cart_items table in Supabase
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Add to cart
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
      
      saveCart(updatedCart);
      toast.success(`${product.name} added to cart`);
      return updatedCart;
    });
  };

  // Update cart item
  const updateCartItem = (id: string, quantity: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  // Remove from cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === id);
      const updatedCart = prevCart.filter(item => item.id !== id);
      
      saveCart(updatedCart);
      
      if (itemToRemove) {
        toast.info(`${itemToRemove.product.name} removed from cart`);
      }
      
      return updatedCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else {
      localStorage.removeItem('cart');
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  // Calculate cart count
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Checkout cart
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
          status: 'processing',
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

      // Insert order items one by one to avoid type issues
      for (const item of orderItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert(item);

        if (itemError) {
          throw itemError;
        }
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

  // Fetch orders
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

  // Fetch order history - implementation for Profile page
  const fetchOrderHistory = async (): Promise<Order[]> => {
    if (!user) return [];
    
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
        return data.map(order => ({
          ...order,
          status: order.status as 'processing' | 'shipped' | 'delivered' | 'cancelled'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching order history:', error);
      toast.error('Failed to load your order history');
      return [];
    }
  };

  // Create aliases for properties needed by components
  const cartItems = cart;
  const updateQuantity = updateCartItem;
  const subTotal = cartTotal;
  const totalItems = cartCount;

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
      fetchOrders,
      
      // Add aliases for backward compatibility
      cartItems,
      updateQuantity,
      subTotal,
      totalItems,
      fetchOrderHistory
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
