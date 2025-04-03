import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Lock, CreditCard } from "lucide-react";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  
  const shippingCost = cartTotal >= 75 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isSuccessful = true;
    
    if (isSuccessful) {
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully.",
      });
      clearCart();
      navigate("/payment-success");
    } else {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center text-sm text-gray-400">
            <Lock className="h-4 w-4 mr-1" />
            Secure Checkout
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-dark-100 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="California"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="94103"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-100 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    <span>Credit Card</span>
                  </div>
                  <div className="flex space-x-2 mb-4">
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-6" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="21" rx="3" fill="#252525"/>
                        <path d="M12 14.5H9.5L7 8H9.5L11 12.5L12.5 8H15L12 14.5Z" fill="#3C8AF7"/>
                        <path d="M16 14.5L14 8H16.5L17.5 12L18.5 8H21L19 14.5H16Z" fill="#F33D3D"/>
                        <path d="M21.5 8H24V14.5H21.5V8Z" fill="#FFD43E"/>
                      </svg>
                    </div>
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-6" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="21" rx="3" fill="#252525"/>
                        <circle cx="12" cy="10.5" r="4" fill="#EB1C26"/>
                        <circle cx="20" cy="10.5" r="4" fill="#F99F1B"/>
                      </svg>
                    </div>
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-6" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="21" rx="3" fill="#252525"/>
                        <path d="M9.5 11H10.5L11 9H10L9.5 11Z" fill="white"/>
                        <path d="M11.5 11H12.5L13 9H12L11.5 11Z" fill="white"/>
                        <path d="M14 9L13.5 11H14.5L15 9H14Z" fill="white"/>
                        <path d="M15 11L16 9H17L16 11H15Z" fill="white"/>
                        <path d="M18 9H17L16.5 11H17.5L18 9Z" fill="white"/>
                        <path d="M18.5 9L18 11H19L19.5 9H18.5Z" fill="white"/>
                        <path d="M22 11V9H20L19.5 11H20.5L20.6 10.5H21.5V11H22Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      className="bg-dark-200 border-white/10"
                    />
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-400 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Your payment information is encrypted and secure.
                </div>
              </div>
              
              <div className="lg:hidden">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Complete Order • $${total.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-dark-100 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-dark-200 rounded overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald">Free</span>
                  ) : (
                    <span>${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Order"}
                </Button>
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                <p>By completing your purchase, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
