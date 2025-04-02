
import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/components/ui/use-toast';

interface GyroscopeViewerProps {
  images: string[];
}

const GyroscopeViewer: React.FC<GyroscopeViewerProps> = ({ images }) => {
  const [active, setActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  
  // Function to handle device orientation changes
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Log data to debug
    console.log("Device orientation:", { 
      alpha: event.alpha, 
      beta: event.beta, 
      gamma: event.gamma 
    });
    
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
        // Check if the browser supports DeviceOrientationEvent
        if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
          // Modern browsers require permission on iOS 13+
          if ((DeviceOrientationEvent as any).requestPermission && 
              typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            console.log("Requesting device orientation permission");
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
              setActive(true);
              toast({
                title: 'Gyroscope Active',
                description: 'Tilt your device to view different angles',
              });
            } else {
              toast({
                title: 'Permission Denied',
                description: 'Permission to access device orientation was denied',
                variant: 'destructive'
              });
            }
          } else {
            // For devices that don't require permission
            window.addEventListener('deviceorientation', handleOrientation);
            setActive(true);
            toast({
              title: 'Gyroscope Active',
              description: 'Tilt your device to view different angles',
            });
            
            // Test if events are actually firing
            setTimeout(() => {
              if (deviceOrientation.alpha === 0 && 
                  deviceOrientation.beta === 0 && 
                  deviceOrientation.gamma === 0) {
                toast({
                  title: 'No Orientation Data',
                  description: 'Your device may not support gyroscope features',
                  variant: 'destructive'
                });
                
                // Fallback to manual rotation
                setActive(false);
                window.removeEventListener('deviceorientation', handleOrientation);
              }
            }, 1000);
          }
        } else {
          toast({
            title: 'Not Supported',
            description: 'Device orientation is not supported by your browser',
            variant: 'destructive'
          });
        }
      } else {
        // Turn off gyroscope
        window.removeEventListener('deviceorientation', handleOrientation);
        setActive(false);
        toast({
          title: 'Gyroscope Disabled',
          description: 'Returned to standard view',
        });
      }
    } catch (error) {
      console.error('Error accessing device orientation:', error);
      toast({
        title: 'Error',
        description: 'Your device or browser may not support gyroscope features',
        variant: 'destructive'
      });
      setActive(false);
    }
  };
  
  // Manual image navigation when gyroscope is not available
  const navigateImages = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev < images.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : images.length - 1
      );
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
      
      <div className="mt-4 flex justify-center gap-2">
        <Button
          onClick={toggleGyroscope}
          variant={active ? "destructive" : "outline"}
          className="flex items-center gap-2"
        >
          <Compass className="h-4 w-4" />
          {active ? "Disable" : "Enable"} Gyroscope View
        </Button>
        
        {!active && (
          <div className="flex gap-2">
            <Button onClick={() => navigateImages('prev')} variant="secondary">
              Previous
            </Button>
            <Button onClick={() => navigateImages('next')} variant="secondary">
              Next
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        {active 
          ? "Tilt your device to view different angles" 
          : "Enable gyroscope or use buttons to rotate view"}
      </p>
    </div>
  );
};

export default GyroscopeViewer;
