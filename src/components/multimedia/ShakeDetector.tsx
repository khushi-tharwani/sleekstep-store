
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ShakeDetectorProps {
  sensitivity?: number;
  onShake?: () => void;
  children: React.ReactNode;
}

const ShakeDetector: React.FC<ShakeDetectorProps> = ({ 
  sensitivity = 15, 
  onShake, 
  children 
}) => {
  const [lastAccel, setLastAccel] = useState({ x: 0, y: 0, z: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  // Handle device motion to detect shake
  const handleMotionEvent = useCallback((event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return;
    
    const { x = 0, y = 0, z = 0 } = event.accelerationIncludingGravity;
    
    // Calculate movement
    const deltaX = Math.abs(x - lastAccel.x);
    const deltaY = Math.abs(y - lastAccel.y);
    const deltaZ = Math.abs(z - lastAccel.z);
    
    // Update last acceleration values
    setLastAccel({ x, y, z });
    
    // Check if acceleration exceeds threshold for a shake
    const isShakeDetected = (deltaX + deltaY + deltaZ) > sensitivity;
    
    if (isShakeDetected && !isShaking) {
      setIsShaking(true);
      console.log("Shake detected!", { deltaX, deltaY, deltaZ });
      
      if (onShake) {
        onShake();
      } else {
        toast.success("Shake detected! 🔄");
      }
      
      // Reset shake state after a delay
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    }
  }, [lastAccel, sensitivity, isShaking, onShake]);
  
  // Toggle device motion detection
  const toggleDetection = async () => {
    if (isDetecting) {
      // Turn off detection
      window.removeEventListener('devicemotion', handleMotionEvent);
      setIsDetecting(false);
      toast.info("Shake detection disabled");
      return;
    }
    
    try {
      // Check if we need to request permission (iOS 13+)
      if ((DeviceMotionEvent as any).requestPermission && 
          typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        setPermissionStatus(permissionState);
        
        if (permissionState === 'granted') {
          startDetection();
        } else {
          toast.error("Permission to access motion sensors was denied");
        }
      } else {
        // For devices that don't require permission
        startDetection();
      }
    } catch (error) {
      console.error("Error accessing device motion:", error);
      toast.error("Your device may not support motion detection");
      setPermissionStatus('unsupported');
    }
  };
  
  const startDetection = () => {
    window.addEventListener('devicemotion', handleMotionEvent);
    setIsDetecting(true);
    toast.success("Shake detection enabled! Try shaking your device");
  };
  
  // Clean up event listener on unmount
  useEffect(() => {
    return () => {
      if (isDetecting) {
        window.removeEventListener('devicemotion', handleMotionEvent);
      }
    };
  }, [isDetecting, handleMotionEvent]);
  
  return (
    <div className="relative">
      {isDetecting && (
        <div className="absolute top-2 right-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded-full">
          Shake Detection Active
        </div>
      )}
      
      <div className={`transition-all duration-300 ${isShaking ? 'animate-pulse' : ''}`}>
        {children}
      </div>
      
      <div className="mt-4">
        <button
          onClick={toggleDetection}
          className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex justify-center items-center gap-2"
        >
          {isDetecting ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Disable Shake Detection
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Enable Shake Detection
            </>
          )}
        </button>
      </div>
      
      {permissionStatus === 'unsupported' && (
        <div className="mt-2 text-center text-amber-500 text-sm">
          Your device or browser may not support motion detection
        </div>
      )}
    </div>
  );
};

export default ShakeDetector;
