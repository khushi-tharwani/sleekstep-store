
import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';
import { Button } from '../ui/button';

interface GyroscopeViewerProps {
  images: string[];
}

const GyroscopeViewer: React.FC<GyroscopeViewerProps> = ({ images }) => {
  const [active, setActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  
  // Function to handle device orientation changes
  const handleOrientation = (event: DeviceOrientationEvent) => {
    setDeviceOrientation({
      alpha: event.alpha || 0, // Z-axis rotation (compass direction)
      beta: event.beta || 0,   // X-axis rotation (front-to-back tilt)
      gamma: event.gamma || 0  // Y-axis rotation (side-to-side tilt)
    });
    
    // Map the gamma rotation (-90 to 90 degrees) to image index
    if (images.length > 1) {
      // Normalize gamma to 0-180 range
      const normalizedGamma = (event.gamma || 0) + 90;
      // Map to image index
      const imageIndex = Math.floor((normalizedGamma / 180) * images.length);
      // Clamp to valid index range
      const clampedIndex = Math.min(Math.max(0, imageIndex), images.length - 1);
      setCurrentImageIndex(clampedIndex);
    }
  };
  
  // Toggle gyroscope mode
  const toggleGyroscope = async () => {
    try {
      if (!active) {
        // Request permission to access device orientation
        // Check if the browser supports DeviceOrientationEvent
        if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
          // Modern browsers require permission on iOS 13+
          // But not all browsers implement requestPermission
          const requestPermission = (DeviceOrientationEvent as any).requestPermission;
          if (requestPermission && typeof requestPermission === 'function') {
            const permissionState = await requestPermission();
            
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
              setActive(true);
            } else {
              alert('Permission to access device orientation was denied');
            }
          } else {
            // For devices that don't require permission (older devices, desktop)
            window.addEventListener('deviceorientation', handleOrientation);
            setActive(true);
          }
        } else {
          alert('Device orientation is not supported by your browser');
        }
      } else {
        // Turn off gyroscope
        window.removeEventListener('deviceorientation', handleOrientation);
        setActive(false);
      }
    } catch (error) {
      console.error('Error accessing device orientation:', error);
      alert('Your device or browser may not support gyroscope features');
    }
  };
  
  // Clean up event listener on unmount
  useEffect(() => {
    return () => {
      if (active) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [active]);

  return (
    <div className="relative">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={images[currentImageIndex]} 
          alt={`Product view ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {active && (
        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          Gyroscope Active
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <Button
          onClick={toggleGyroscope}
          variant={active ? "destructive" : "outline"}
          className="flex items-center gap-2"
        >
          <Compass className="h-4 w-4" />
          {active ? "Disable" : "Enable"} Gyroscope View
        </Button>
      </div>
    </div>
  );
};

export default GyroscopeViewer;
