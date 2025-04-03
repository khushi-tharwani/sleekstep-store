
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration if needed
  const mockOrders: Order[] = [
    {
      id: "1",
      user_id: user?.id || '',
      total: 299.97,
      status: "delivered",
      created_at: "2025-03-15T10:30:00Z",
      updated_at: "2025-03-16T14:20:00Z",
      payment_method: "Credit Card",
      address_id: "addr1",
      order_items: [
        {
          id: "item1",
          order_id: "1",
          product_id: "prod1",
          quantity: 2,
          price: 99.99,
          size: "US 10",
          color: "Black"
        },
        {
          id: "item2",
          order_id: "1",
          product_id: "prod2",
          quantity: 1,
          price: 99.99,
          size: "US 9",
          color: "White"
        }
      ]
    },
    {
      id: "2",
      user_id: user?.id || '',
      total: 159.98,
      status: "shipped",
      created_at: "2025-03-10T09:15:00Z",
      updated_at: "2025-03-11T11:45:00Z",
      payment_method: "PayPal",
      address_id: "addr2",
      order_items: [
        {
          id: "item3",
          order_id: "2",
          product_id: "prod3",
          quantity: 1,
          price: 159.98,
          size: "US 8",
          color: "Red"
        }
      ]
    },
    {
      id: "3", 
      user_id: user?.id || '',
      total: 249.95,
      status: "processing",
      created_at: "2025-03-20T15:45:00Z",
      updated_at: "2025-03-20T15:45:00Z",
      payment_method: "Apple Pay",
      address_id: "addr1",
      order_items: [
        {
          id: "item4",
          order_id: "3",
          product_id: "prod4",
          quantity: 1,
          price: 249.95,
          size: "US 11",
          color: "Blue"
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch orders from Supabase
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // If no orders found in Supabase, use mock data for demo
        if (data && data.length > 0) {
          setOrders(data);
        } else {
          console.log("No orders found in Supabase, using mock data");
          setOrders(mockOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Failed to fetch orders",
          description: "Something went wrong. Using sample data instead.",
          variant: "destructive",
        });
        setOrders(mockOrders);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500/20 text-yellow-500";
      case "shipped":
        return "bg-blue-500/20 text-blue-500";
      case "delivered":
        return "bg-green-500/20 text-green-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <Badge className="px-3 py-1">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </Badge>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-gray-800/50 rounded-lg p-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-medium">No orders yet</h2>
            <p className="mt-2 text-gray-400">
              When you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800/50 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                      <span className="mx-2">•</span>
                      <Badge
                        className={`${getStatusColor(order.status)} border-none`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-3">${order.total.toFixed(2)}</span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="p-4 pt-0 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-4 grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-white">Payment Method</span>
                        {order.payment_method}
                      </div>
                      <div>
                        <span className="block text-white">Items</span>
                        {order.order_items?.length || 0} items
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center p-3 bg-gray-700/30 rounded-md"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              Product #{item.product_id.slice(0, 8)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {item.size} • {item.color} • Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="font-medium">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                      <span>Total</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
