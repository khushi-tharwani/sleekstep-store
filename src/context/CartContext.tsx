
import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem, Product, Order } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subTotal: number;
  saveOrderToDatabase: (addressId: string, paymentMethod: string) => Promise<string | null>;
  fetchOrderHistory: () => Promise<Order[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing saved cart:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);
  
  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    // Check if product with same size and color already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === product.id && item.size === size && item.color === color
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      const updatedCart = cartItems.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
      setCartItems(updatedCart);
      toast({
        title: "Cart updated",
        description: `${product.name} quantity updated in your cart.`,
      });
    } else {
      // Add new item if it doesn't exist
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        productId: product.id,
        product,
        quantity,
        size,
        color
      };
      setCartItems([...cartItems, newItem]);
      toast({
        title: "Item added",
        description: `${product.name} added to your cart.`,
      });
    }
  };
  
  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    toast({
      title: "Item removed",
      description: "Product removed from your cart.",
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };
  
  // Save order to database with better error handling and transaction support
  const saveOrderToDatabase = async (addressId: string, paymentMethod: string): Promise<string | null> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please login to complete your order.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const subTotal = cartItems.reduce(
        (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 
        0
      );
      
      // Use Supabase's RPC to execute a stored procedure in a single transaction
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: subTotal,
          address_id: addressId,
          payment_method: paymentMethod,
          status: 'processing'
        })
        .select('id')
        .single();
      
      if (orderError) {
        throw new Error(`Order creation failed: ${orderError.message}`);
      }
      
      if (!orderData?.id) {
        throw new Error('Order was created but no ID was returned');
      }
      
      const orderId = orderData.id;
      
      // Then add order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
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
        console.error('Failed to add order items:', itemsError);
        toast({
          title: 'Warning',
          description: 'Order created but some items may not have been added correctly.',
          variant: 'destructive'
        });
      }
      
      // Add a webhook call to an external API to track order analytics
      try {
        await fetch('https://api.example.com/order/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId,
            userId: user.id,
            totalAmount: subTotal,
            itemCount: cartItems.length,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookError) {
        // Non-critical error, just log it
        console.warn("Analytics webhook failed:", webhookError);
      }
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      
      clearCart();
      return orderId;
    } catch (error: any) {
      console.error("Error saving order:", error);
      toast({
        title: "Order failed",
        description: error.message || "Failed to place your order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Fetch order history for the current user
  const fetchOrderHistory = async (): Promise<Order[]> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your order history.",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return orders || [];
    } catch (error: any) {
      console.error("Error fetching order history:", error);
      toast({
        title: "Failed to load orders",
        description: error.message || "Unable to retrieve your order history.",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const subTotal = cartItems.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subTotal,
        saveOrderToDatabase,
        fetchOrderHistory
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
