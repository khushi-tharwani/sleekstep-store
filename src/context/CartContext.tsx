
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product, Order } from '@/types';
import { useAuth } from './AuthContext';
import { supabase, deleteCartItems, addCartItem, getCartWithProducts } from '@/integrations/supabase/client';
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

  const syncCartWithDatabase = async (updatedCart: CartItem[]) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First, fetch product data for each cart item
      const productIds = updatedCart.map(item => item.productId);
      
      // Delete existing cart items
      await deleteCartItems(user.id);
      
      // Then insert the current cart items
      if (updatedCart.length > 0) {
        // Insert items one by one to avoid type issues
        for (const item of updatedCart) {
          await addCartItem(
            user.id,
            item.productId,
            item.quantity,
            item.size,
            item.color
          );
        }
        
        console.log('Cart successfully synced with database');
      }
    } catch (error) {
      console.error('Error in syncCartWithDatabase:', error);
      toast.error('Failed to sync your cart with the database');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      if (!user) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        return;
      }

      setLoading(true);
      
      // Try to load cart items via RPC function
      const { data, error } = await getCartWithProducts(user.id);
      
      if (!error && data && Array.isArray(data) && data.length > 0) {
        // Convert response to CartItem format
        const cartItems: CartItem[] = await Promise.all(
          data.map(async (item: any) => {
            // Fetch the product details
            const { data: productData } = await supabase
              .from('products')
              .select('*, product_sizes(*), product_colors(*)')
              .eq('id', item.product_id)
              .single();
            
            if (!productData) {
              console.error(`Product not found for id: ${item.product_id}`);
              return null;
            }
            
            // Convert product data to our Product type
            const product: Product = {
              id: productData.id,
              name: productData.name,
              brand: productData.brand,
              category: productData.category,
              price: productData.price,
              salePrice: productData.sale_price,
              description: productData.description,
              images: productData.images,
              sizes: productData.product_sizes.map((size: any) => ({
                id: size.id,
                value: size.value,
                available: size.available
              })),
              colors: productData.product_colors.map((color: any) => ({
                id: color.id,
                name: color.name,
                value: color.value,
                available: color.available
              })),
              stock: productData.stock,
              rating: productData.rating,
              reviews: [],
              isFeatured: productData.is_featured,
              isTrending: productData.is_trending,
              createdAt: productData.created_at,
              qrCode: productData.qr_code
            };
  
            return {
              id: nanoid(),
              productId: item.product_id,
              product,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            };
          })
        );
        
        // Filter out null items
        const validCartItems = cartItems.filter(item => item !== null) as CartItem[];
        
        setCart(validCartItems);
        // Also update localStorage
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(validCartItems));
      } else {
        // Fall back to localStorage if database fetch fails or is empty
        const savedCart = localStorage.getItem(`cart_${user.id}`);
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          setCart(cartItems);
          // Sync these items to database
          syncCartWithDatabase(cartItems);
        }
      }
    } catch (error) {
      console.error('Error in loadCart:', error);
      toast.error('Failed to load your cart');
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (updatedCart: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
      syncCartWithDatabase(updatedCart);
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
      // Also clear cart items from database
      deleteCartItems(user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error clearing cart from database:', error);
          }
        });
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
      // Log data for debugging
      console.log("Checkout data:", { 
        user_id: user.id, 
        total: cartTotal, 
        payment_method: paymentMethod, 
        address_id: addressId,
        cart_items: cart.length
      });

      // Create order in database
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

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }

      if (!orderData) {
        throw new Error('Failed to create order - no data returned');
      }

      console.log("Order created:", orderData);

      // Process order with Supabase Edge Function
      const { data: processData, error: processError } = await supabase.functions.invoke('process-order', {
        body: { orderId: orderData.id }
      });

      if (processError) {
        console.error("Error processing order:", processError);
        // Continue with order items creation even if processing fails
        // We don't want to throw here as the order is already created
      } else {
        console.log("Order processed:", processData);
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

      console.log("Creating order items:", orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw itemsError;
      }

      // Clear the cart from both local storage and database
      clearCart();
      
      toast.success("Order placed successfully!");
      return true;
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error("Failed to complete your order: " + (error as Error).message);
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
