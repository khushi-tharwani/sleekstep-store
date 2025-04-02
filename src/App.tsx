
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/product/ProductDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CartPage from "./pages/cart/Cart";
import CheckoutPage from "./pages/checkout/Checkout";
import PaymentSuccess from "./pages/checkout/PaymentSuccess";
import OrdersPage from "./pages/orders/Orders";
import AdminProducts from "./pages/admin/Products";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/auth/AdminRoute";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
