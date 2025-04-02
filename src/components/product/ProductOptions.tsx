
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductColor, ProductSize } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Check, ShoppingCart } from 'lucide-react';

interface ProductOptionsProps {
  product: Product;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        title: "Please select a color",
        description: "You need to select a color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
  };

  // Available sizes (filter out unavailable ones)
  const availableSizes = product.sizes.filter(size => size.available);
  
  // Available colors (filter out unavailable ones)
  const availableColors = product.colors.filter(color => color.available);

  // Increase quantity
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Price display */}
      <div>
        {product.salePrice ? (
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-primary">${product.salePrice}</span>
            <span className="text-xl line-through text-gray-400">${product.price}</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              Save ${(product.price - product.salePrice).toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold">${product.price}</span>
        )}
      </div>

      {/* Size selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Size <span className="text-red-500">*</span>
        </label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {availableSizes.length > 0 ? (
              availableSizes.map((size: ProductSize) => (
                <SelectItem key={size.id} value={size.value}>
                  {size.value}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No sizes available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Color selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Color <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color: ProductColor) => (
            <button
              key={color.id}
              type="button"
              aria-label={`Select color ${color.name}`}
              onClick={() => setSelectedColor(color.name)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                selectedColor === color.name
                  ? 'border-primary shadow-lg'
                  : 'border-transparent'
              }`}
              style={{ 
                backgroundColor: color.value,
                boxShadow: selectedColor === color.name ? '0 0 0 2px rgba(255,255,255,0.5)' : 'none'
              }}
            >
              {selectedColor === color.name && (
                <Check className="h-5 w-5 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
        {selectedColor && (
          <p className="text-sm mt-1">Selected: {selectedColor}</p>
        )}
      </div>

      {/* Quantity selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Quantity</label>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
          >
            +
          </Button>
          <span className="ml-4 text-sm text-gray-500">
            {product.stock} available
          </span>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </div>
  );
};

export default ProductOptions;
