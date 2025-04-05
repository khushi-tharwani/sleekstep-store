
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Import components and pages
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import MediaGallery from '@/pages/MediaGallery';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import AdminLogin from '@/pages/auth/AdminLogin';
import Profile from '@/pages/user/Profile';
import LoadingSpinner from '@/components/LoadingSpinner';

// Create lazy-loaded component for Categories
const Categories = React.lazy(() => import('@/pages/Categories'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Categories />
            </Suspense>
          } />
          <Route path="/media-gallery" element={<MediaGallery />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <div>Admin Dashboard</div>
            </AdminRoute>
          } />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
