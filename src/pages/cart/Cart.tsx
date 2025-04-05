
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, cartTotal, cartCount } = useCart();
  const { toast } = useToast();
  
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateCartItem(itemId, newQuantity);
  };
  
  const shippingCost = cartTotal >= 75 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-dark-100 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-dark-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-dark-200 text-left">
                    <tr>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Quantity</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6 sr-only">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-dark-200/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 bg-dark-200 rounded overflow-hidden mr-4">
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-gray-400">
                                <span>Size: {item.size}</span>
                                <span className="mx-2">•</span>
                                <span>Color: {item.product.colors.find(c => c.value === item.color)?.name}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {item.product.salePrice ? (
                            <div>
                              <span className="font-medium">${item.product.salePrice.toFixed(2)}</span>
                              <span className="text-destructive line-through text-sm ml-2">
                                ${item.product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">${item.product.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-l-md hover:bg-dark-300"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center border-t border-b border-white/20">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-r-md hover:bg-dark-300"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium">
                          ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Remove item</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Link to="/products">
                  <Button variant="outline" className="border-white/20 hover:bg-dark-200">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-dark-100 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Items ({cartCount})</span>
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
                  {shippingCost > 0 && (
                    <div className="pt-2 text-xs text-gray-400">
                      <p>Free shipping on orders over $75</p>
                      <p>You're ${(75 - cartTotal).toFixed(2)} away from free shipping</p>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link to="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="mt-6">
                  <div className="text-sm text-gray-400 mb-2">
                    We accept
                  </div>
                  <div className="flex space-x-2">
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-8" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="31" height="20" rx="3.5" fill="#252525" stroke="#ffffff20"/>
                        <path d="M11.5 14.5H9L7 8H9.5L10.5 12.5L11.5 8H14L11.5 14.5Z" fill="white"/>
                        <path d="M14.5 8H17L17.5 12L19 8H21.5L19 14.5H16.5L14.5 8Z" fill="white"/>
                        <path d="M22 14.5V8H24.5V14.5H22Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-8" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="31" height="20" rx="3.5" fill="#252525" stroke="#ffffff20"/>
                        <path d="M12 14.5H9.5L7 8H9.5L11 12.5L12.5 8H15L12 14.5Z" fill="#3C8AF7"/>
                        <path d="M16 14.5L14 8H16.5L17.5 12L18.5 8H21L19 14.5H16Z" fill="#F33D3D"/>
                        <path d="M21.5 8H24V14.5H21.5V8Z" fill="#FFD43E"/>
                      </svg>
                    </div>
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-8" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="31" height="20" rx="3.5" fill="#252525" stroke="#ffffff20"/>
                        <circle cx="12" cy="10.5" r="4" fill="#EB1C26"/>
                        <circle cx="20" cy="10.5" r="4" fill="#F99F1B"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M16 13C15.204 12.072 14.75 10.838 14.75 9.5C14.75 8.162 15.204 6.928 16 6C16.796 6.928 17.25 8.162 17.25 9.5C17.25 10.838 16.796 12.072 16 13Z" fill="#EF7D00"/>
                      </svg>
                    </div>
                    <div className="bg-dark-200 rounded p-1">
                      <svg className="h-8" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="31" height="20" rx="3.5" fill="#252525" stroke="#ffffff20"/>
                        <path d="M9.5 11H10.5L11 9H10L9.5 11Z" fill="white"/>
                        <path d="M11.5 11H12.5L13 9H12L11.5 11Z" fill="white"/>
                        <path d="M14 9L13.5 11H14.5L15 9H14Z" fill="white"/>
                        <path d="M15 11L16 9H17L16 11H15Z" fill="white"/>
                        <path d="M18 9H17L16.5 11H17.5L18 9Z" fill="white"/>
                        <path d="M18.5 9L18 11H19L19.5 9H18.5Z" fill="white"/>
                        <path d="M22 11V9H20L19.5 11H20.5L20.6 10.5H21.5V11H22Z" fill="white"/>
                        <path d="M21.5 9.5H20.7L20.8 9.8H21.5V9.5Z" fill="white"/>
                        <path d="M14 12H10V12.5H14V12Z" fill="white"/>
                        <path d="M12.5 13H10V13.5H12.5V13Z" fill="white"/>
                        <path d="M18.5 13.5V12H22V12.5H19V13.5H18.5Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
