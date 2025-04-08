
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Smartphone, Activity } from 'lucide-react';

interface ShakeDetectorProps {
  sensitivity?: number;
  onShake?: () => void;
  enableVibration?: boolean;
  children: React.ReactNode;
}

const ShakeDetector: React.FC<ShakeDetectorProps> = ({ 
  sensitivity = 15, 
  onShake, 
  enableVibration = true,
  children 
}) => {
  const [lastAccel, setLastAccel] = useState({ x: 0, y: 0, z: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  // Handle device motion to detect shake
  const handleMotionEvent = useCallback((event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return;
    
    const { x = 0, y = 0, z = 0 } = event.accelerationIncludingGravity;
    
    // Calculate movement
    const deltaX = Math.abs(x - lastAccel.x);
    const deltaY = Math.abs(y - lastAccel.y);
    const deltaZ = Math.abs(z - lastAccel.z);
    
    // Compute shake intensity (scaled for UI display)
    const totalDelta = deltaX + deltaY + deltaZ;
    const newShakeIntensity = Math.min(100, Math.floor((totalDelta / sensitivity) * 33));
    setShakeIntensity(newShakeIntensity);
    
    // Update last acceleration values
    setLastAccel({ x, y, z });
    
    // Check if acceleration exceeds threshold for a shake
    const isShakeDetected = totalDelta > sensitivity;
    
    if (isShakeDetected && !isShaking) {
      setIsShaking(true);
      setShakeCount(prev => prev + 1);
      console.log("Shake detected!", { deltaX, deltaY, deltaZ, intensity: totalDelta });
      
      // Use vibration API if available and enabled
      if (enableVibration && 'vibrate' in navigator) {
        try {
          navigator.vibrate(200);
        } catch (e) {
          console.log("Vibration not supported on this device");
        }
      }
      
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
  }, [lastAccel, sensitivity, isShaking, onShake, enableVibration]);
  
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
    toast.success("Shake detection enabled! Try shaking your device to find random videos");
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
        <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-primary/90 to-primary/70 text-white px-3 py-2 rounded-bl-lg shadow-md flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">Shake Detection Active</span>
          {shakeCount > 0 && (
            <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
              {shakeCount}
            </span>
          )}
        </div>
      )}
      
      <div className={`transition-all duration-300 ${isShaking ? 'animate-pulse' : ''}`}>
        {children}
      </div>
      
      {isDetecting && (
        <div className="my-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Shake Intensity</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {shakeIntensity}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${shakeIntensity}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-center">
        <button
          onClick={toggleDetection}
          className={`py-2 px-4 rounded-md inline-flex justify-center items-center gap-2 transition-colors text-sm ${
            isDetecting 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          {isDetecting ? "Disable Shake" : "Enable Shake Detection"}
        </button>
      </div>
      
      {permissionStatus === 'unsupported' && (
        <div className="mt-1 text-center text-amber-500 text-xs">
          Your device may not support motion detection
        </div>
      )}
    </div>
  );
};

export default ShakeDetector;
