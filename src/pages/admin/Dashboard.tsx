
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCcw, ShoppingBag, Users, Package, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface StatsData {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

interface RecentOrder {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  user_name?: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
}

const AdminDashboard = () => {
  const { isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin-login');
    } else if (!isLoading && isAdmin) {
      fetchDashboardData();
    }
  }, [isLoading, isAdmin, navigate]);

  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    try {
      // Fetch stats
      const [ordersData, usersData, productsData] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('products').select('*')
      ]);

      if (!ordersData.error && !usersData.error && !productsData.error) {
        const totalRevenue = ordersData.data.reduce((sum, order) => sum + (order.total || 0), 0);
        
        setStats({
          totalOrders: ordersData.data.length,
          totalRevenue,
          totalUsers: usersData.data.length,
          totalProducts: productsData.data.length
        });
      }

      // Fetch recent orders with user info
      const { data: recentOrdersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!ordersError && recentOrdersData) {
        const formattedOrders = recentOrdersData.map(order => ({
          id: order.id,
          user_id: order.user_id,
          total: order.total,
          status: order.status,
          created_at: order.created_at,
          user_name: order.profiles?.name || 'Unknown User'
        }));
        setRecentOrders(formattedOrders);
      }

      // Fetch recent users
      const { data: recentUsersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!usersError && recentUsersData) {
        setRecentUsers(recentUsersData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsDataLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
    toast.success('Dashboard data refreshed');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={refreshData} disabled={isDataLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {isDataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <ShoppingBag className="text-muted-foreground absolute top-4 right-4 h-4 w-4" />
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full justify-start" 
                    onClick={() => navigate('/admin/orders')}>
                    View All Orders
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <Users className="text-muted-foreground absolute top-4 right-4 h-4 w-4" />
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full justify-start" 
                    onClick={() => navigate('/admin/users')}>
                    Manage Users
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <Package className="text-muted-foreground absolute top-4 right-4 h-4 w-4" />
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full justify-start" 
                    onClick={() => navigate('/admin/products')}>
                    Manage Products
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                <TabsTrigger value="users">Recent Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Recent customer orders across the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Order ID</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                              <tr key={order.id} className="border-b">
                                <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                                <td className="py-3 px-4">{order.user_name}</td>
                                <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-4 text-center">No orders found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" onClick={() => navigate('/admin/orders')}>
                      View All Orders
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Recently registered users on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">User</th>
                            <th className="text-left py-3 px-4">Email</th>
                            <th className="text-left py-3 px-4">Role</th>
                            <th className="text-left py-3 px-4">Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.length > 0 ? (
                            recentUsers.map((user) => (
                              <tr key={user.id} className="border-b">
                                <td className="py-3 px-4">{user.name || 'No Name'}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.role || 'user'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 text-center">No users found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" onClick={() => navigate('/admin/users')}>
                      Manage Users
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
