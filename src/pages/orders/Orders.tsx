
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Package, ShoppingBag, Truck, CheckCircle, XCircle } from 'lucide-react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { fetchOrders, orders } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchOrders();
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user, fetchOrders]);

  // Function to determine the badge color based on order status
  const getStatusBadge = (status: 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    switch (status) {
      case 'processing':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Package className="h-4 w-4 mr-1" /> };
      case 'shipped':
        return { color: 'bg-blue-100 text-blue-800', icon: <Truck className="h-4 w-4 mr-1" /> };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 mr-1" /> };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <ShoppingBag className="h-4 w-4 mr-1" /> };
    }
  };

  // Function to format the date in a readable format
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <h1 className="text-2xl font-bold mb-6">Orders</h1>
          <p>Please log in to view your orders.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2].map((_, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4">
                      <div className="h-16 w-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              
              return (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed {formatDate(order.created_at)}
                        </p>
                      </div>
                      <Badge 
                        className={`flex items-center ${statusBadge.color} px-2 py-1`}
                        variant="outline"
                      >
                        {statusBadge.icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <span className="font-semibold">Total:</span> ${order.total.toFixed(2)}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Payment Method:</span> {order.payment_method}
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <div className="space-y-3">
                      {order.order_items && order.order_items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                            Item
                          </div>
                          <div>
                            <p className="font-medium">Product #{item.product_id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size}, Color: {item.color}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Button onClick={() => window.location.href = '/products'}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
