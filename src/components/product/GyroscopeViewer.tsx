
import React, { useState, useEffect, useRef } from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface GyroscopeViewerProps {
  images: string[];
}

const GyroscopeViewer: React.FC<GyroscopeViewerProps> = ({ images }) => {
  const [active, setActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [calibrated, setCalibrated] = useState(false);
  const [calibrationValues, setCalibrationValues] = useState({ gamma: 0 });
  const lastGamma = useRef(0);
  const orientationRef = useRef<number | null>(null);
  
  // Function to handle device orientation changes
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (!active) return;
    
    // Log data to debug
    console.log("Device orientation:", { 
      alpha: event.alpha, 
      beta: event.beta, 
      gamma: event.gamma 
    });
    
    // Save the orientation data
    setDeviceOrientation({
      alpha: event.alpha || 0, // Z-axis rotation (compass direction)
      beta: event.beta || 0,   // X-axis rotation (front-to-back tilt)
      gamma: event.gamma || 0  // Y-axis rotation (side-to-side tilt)
    });
    
    // If we have gamma data and images
    if (typeof event.gamma === 'number' && images.length > 1) {
      // Apply calibration
      const calibratedGamma = event.gamma - calibrationValues.gamma;
      lastGamma.current = calibratedGamma;
      
      // Map to image index - use a wider range for better control
      // Normalize gamma to 0-180 range (from -90 to +90)
      const normalizedGamma = calibratedGamma + 90;
      
      // Map to image index with more sensitivity
      const imageIndex = Math.floor((normalizedGamma / 180) * images.length);
      
      // Clamp to valid index range
      const clampedIndex = Math.min(Math.max(0, imageIndex), images.length - 1);
      
      // Only update if changed to avoid unnecessary re-renders
      if (clampedIndex !== currentImageIndex) {
        setCurrentImageIndex(clampedIndex);
      }
    }
  };
  
  // Function to calibrate the gyroscope
  const calibrateGyroscope = () => {
    if (deviceOrientation.gamma !== null) {
      setCalibrationValues({
        gamma: deviceOrientation.gamma
      });
      setCalibrated(true);
      toast.success("Gyroscope calibrated. Hold your device in your preferred center position.");
    }
  };
  
  // Toggle gyroscope mode
  const toggleGyroscope = async () => {
    try {
      if (!active) {
        // Check if the browser supports DeviceOrientationEvent
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
          // Modern browsers require permission on iOS 13+
          if ((DeviceOrientationEvent as any).requestPermission && 
              typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            console.log("Requesting device orientation permission");
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            
            if (permissionState === 'granted') {
              startGyroscope();
            } else {
              toast.error('Permission to access device orientation was denied');
            }
          } else {
            // For devices that don't require permission
            startGyroscope();
          }
        } else {
          toast.error('Device orientation is not supported by your browser');
        }
      } else {
        // Turn off gyroscope
        stopGyroscope();
      }
    } catch (error) {
      console.error('Error accessing device orientation:', error);
      toast.error('Your device or browser may not support gyroscope features');
      setActive(false);
    }
  };
  
  const startGyroscope = () => {
    if (orientationRef.current) {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
    
    window.addEventListener('deviceorientation', handleOrientation);
    orientationRef.current = 1;
    setActive(true);
    toast.success('Gyroscope Active: Tilt your device to view different angles');
    
    // Test if events are actually firing after a short delay
    setTimeout(() => {
      if (deviceOrientation.alpha === 0 && 
          deviceOrientation.beta === 0 && 
          deviceOrientation.gamma === 0) {
        toast.error('No orientation data detected. Your device may not support gyroscope features');
        
        // Fallback to manual rotation
        stopGyroscope();
      } else {
        // Initial calibration
        calibrateGyroscope();
      }
    }, 1000);
  };
  
  const stopGyroscope = () => {
    if (orientationRef.current) {
      window.removeEventListener('deviceorientation', handleOrientation);
      orientationRef.current = null;
    }
    setActive(false);
    toast.info('Gyroscope Disabled: Returned to standard view');
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
  
  // Add tilt detection using the device motion events for devices that support it
  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (!active) return;
      
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;
      
      // Use acceleration data as an alternative to orientation
      // This can be more reliable on some devices
      console.log("Device motion:", {
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z
      });
      
      // We can use this data to supplement the orientation data if needed
    };
    
    // Add device motion listener
    window.addEventListener('devicemotion', handleDeviceMotion);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('devicemotion', handleDeviceMotion);
      if (orientationRef.current) {
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
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button
          onClick={toggleGyroscope}
          variant={active ? "destructive" : "outline"}
          className="flex items-center gap-2"
        >
          <Compass className="h-4 w-4" />
          {active ? "Disable" : "Enable"} Gyroscope View
        </Button>
        
        {active && (
          <Button
            onClick={calibrateGyroscope}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Calibrate
          </Button>
        )}
        
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
          ? "Tilt your device left/right to view different angles"
          : "Enable gyroscope or use buttons to rotate view"}
      </p>
      
      {active && (
        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>Orientation data: γ={Math.round(lastGamma.current)}° (used for rotation)</p>
          <p>Image: {currentImageIndex + 1}/{images.length}</p>
        </div>
      )}
    </div>
  );
};

export default GyroscopeViewer;
