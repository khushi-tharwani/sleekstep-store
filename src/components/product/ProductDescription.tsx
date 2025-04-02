
import React from "react";

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Description</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default ProductDescription;
