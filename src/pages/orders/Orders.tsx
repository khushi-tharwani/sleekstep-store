
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/types";
import { Package, CreditCard, TruckIcon, CheckCircle } from "lucide-react";

// Mock order data for demo purposes
const mockOrders: Order[] = [
  {
    id: "ORD12345",
    userId: "u1",
    items: [
      {
        id: "item1",
        productId: "1",
        product: {
          id: "1",
          name: "Air Max Supreme",
          brand: "Nike",
          category: "Running",
          price: 199.99,
          description: "Innovative cushioning...",
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
          sizes: [{ id: "s1", value: "US 9", available: true }],
          colors: [{ id: "c1", name: "Black", value: "#000000", available: true }],
          stock: 15,
          rating: 4.8,
          reviews: [],
          isFeatured: true,
          isTrending: true,
          createdAt: "2023-01-10T08:00:00Z"
        },
        quantity: 1,
        price: 199.99,
        size: "US 9",
        color: "#000000"
      }
    ],
    total: 199.99,
    status: "delivered",
    address: {
      id: "addr1",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
      isDefault: true
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-17T14:20:00Z"
  },
  {
    id: "ORD12346",
    userId: "u1",
    items: [
      {
        id: "item2",
        productId: "2",
        product: {
          id: "2",
          name: "Ultra Boost Elite",
          brand: "Adidas",
          category: "Running",
          price: 179.99,
          description: "Responsive boost cushioning...",
          images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5"],
          sizes: [{ id: "s1", value: "US 10", available: true }],
          colors: [{ id: "c1", name: "Blue", value: "#0000FF", available: true }],
          stock: 8,
          rating: 4.7,
          reviews: [],
          isFeatured: true,
          isTrending: true,
          createdAt: "2023-02-05T10:15:00Z"
        },
        quantity: 1,
        price: 179.99,
        size: "US 10",
        color: "#0000FF"
      }
    ],
    total: 179.99,
    status: "shipped",
    address: {
      id: "addr1",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
      isDefault: true
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-08-21T15:45:00Z",
    updatedAt: "2023-08-22T09:15:00Z"
  },
  {
    id: "ORD12347",
    userId: "u1",
    items: [
      {
        id: "item3",
        productId: "3",
        product: {
          id: "3",
          name: "Classic Leather",
          brand: "Puma",
          category: "Casual",
          price: 89.99,
          description: "Timeless design meets modern comfort...",
          images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86"],
          sizes: [{ id: "s1", value: "US 8", available: true }],
          colors: [{ id: "c1", name: "Brown", value: "#8B4513", available: true }],
          stock: 20,
          rating: 4.5,
          reviews: [],
          isFeatured: false,
          isTrending: false,
          createdAt: "2023-01-20T09:30:00Z"
        },
        quantity: 2,
        price: 89.99,
        size: "US 8",
        color: "#8B4513"
      }
    ],
    total: 179.98,
    status: "processing",
    address: {
      id: "addr1",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
      isDefault: true
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-09-05T11:20:00Z",
    updatedAt: "2023-09-05T11:20:00Z"
  }
];

const OrdersPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    // Simulate API call to get user orders
    const fetchOrders = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setIsLoading(false);
    };
    
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);
  
  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5 text-primary" />;
      case "shipped":
        return <TruckIcon className="h-5 w-5 text-primary" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-emerald" />;
      case "canceled":
        return <CreditCard className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "canceled":
        return "Canceled";
      default:
        return "Processing";
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-400 mb-8">You need to be signed in to view your orders.</p>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-8">
            <TabsList className="bg-dark-100">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-dark-100 rounded-lg p-6">
                    <div className="h-6 bg-dark-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-dark-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-16 bg-dark-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-dark-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-dark-200 rounded w-1/4"></div>
                      </div>
                      <div className="w-20">
                        <div className="h-4 bg-dark-200 rounded mb-2"></div>
                        <div className="h-4 bg-dark-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-dark-100 rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="text-lg font-bold">Order #{order.id}</h3>
                            <span className="ml-4 px-2 py-1 text-xs rounded-full bg-dark-200 text-gray-300">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Total: ${order.total.toFixed(2)} • {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="flex items-center px-3 py-1 rounded-full bg-dark-200">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 text-sm">{getStatusText(order.status)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-dark-200 rounded overflow-hidden">
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <div className="text-sm text-gray-400">
                                <span>Size: {item.size}</span>
                                <span className="mx-2">•</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex flex-wrap gap-4">
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" className="border-white/20 hover:bg-dark-200">
                            View Order Details
                          </Button>
                        </Link>
                        {order.status === "delivered" && (
                          <Button variant="outline" className="border-white/20 hover:bg-dark-200">
                            Write a Review
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-dark-100 rounded-lg">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === "all" 
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <Link to="/products">
                  <Button className="bg-primary hover:bg-primary/90">Start Shopping</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OrdersPage;
