
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  // Generate a random order number
  const orderNumber = `SLK-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-100 rounded-lg p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-primary/20 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-300 mb-6">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>
            
            <div className="bg-dark-200 rounded-lg p-6 mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Order Number</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                We've sent a confirmation email with all the details of your order.
                You can track your order status in your account dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/orders">
                  <Button variant="outline" className="border-white/20 hover:bg-dark-200">
                    View Order Status
                  </Button>
                </Link>
                <Link to="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
