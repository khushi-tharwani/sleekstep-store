import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product, Order } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      if (!user) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        return;
      }

      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error in loadCart:', error);
    }
  };

  const saveCart = (updatedCart: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      const updatedCart = [...prevCart];
      
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
      } else {
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

  const updateCartItem = (id: string, quantity: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      saveCart(updatedCart);
      return updatedCart;
    });
  };

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

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else {
      localStorage.removeItem('cart');
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

      console.log("Order created:", orderData);

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
        size: item.size,
        color: item.color
      }));

      console.log("Creating order items:", orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw itemsError;
      }

      clearCart();
      
      toast.success("Order placed successfully!");
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
      
      cartItems: cart,
      updateQuantity: updateCartItem,
      subTotal: cartTotal,
      totalItems: cartCount,
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
