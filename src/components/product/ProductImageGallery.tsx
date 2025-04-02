
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import GyroscopeViewer from "@/components/product/GyroscopeViewer";
import { QrCode } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  onScannerToggle: () => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images,
  onScannerToggle
}) => {
  const [useGyroscope, setUseGyroscope] = useState(false);

  return (
    <div className="space-y-6">
      {useGyroscope ? (
        <GyroscopeViewer images={images} />
      ) : (
        <>
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[0]}
              alt="Product main image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <img
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="flex gap-2">
        <Button 
          onClick={() => setUseGyroscope(!useGyroscope)} 
          variant="outline" 
          className="flex-1"
        >
          {useGyroscope ? "Standard View" : "Gyroscope View"}
        </Button>
        <Button 
          onClick={onScannerToggle} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          Scan QR
        </Button>
      </div>
    </div>
  );
};

export default ProductImageGallery;
