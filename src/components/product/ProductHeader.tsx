
import React from "react";

interface ProductHeaderProps {
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  name, 
  brand, 
  price, 
  salePrice 
}) => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-lg text-gray-400 mt-1">{brand}</p>
      </div>
      
      <div>
        {salePrice ? (
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">
              ${salePrice.toFixed(2)}
            </span>
            <span className="ml-2 text-lg text-gray-400 line-through">
              ${price.toFixed(2)}
            </span>
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              SALE
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold">
            ${price.toFixed(2)}
          </span>
        )}
      </div>
    </>
  );
};

export default ProductHeader;
