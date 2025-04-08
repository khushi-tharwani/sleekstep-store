
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface TiltState {
  isTiltActive: boolean;
  lastOrientation: { beta: number; gamma: number };
  calibrateTilt: () => void;
  toggleTiltControl: () => Promise<void>;
}

interface TiltControlProps {
  onTiltChange?: (betaDiff: number, gammaDiff: number) => void;
}

export const useTiltControl = ({ onTiltChange }: TiltControlProps = {}): TiltState => {
  const [isTiltActive, setIsTiltActive] = useState(false);
  const [lastOrientation, setLastOrientation] = useState({ beta: 0, gamma: 0 });
  const orientationRef = useRef<number | null>(null);
  const tiltCalibrationRef = useRef({ beta: 0, gamma: 0 });

  // Handle device orientation for tilt control
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (!isTiltActive || !e.beta || !e.gamma) return;

    // Calculate deviation from calibration point
    const betaDiff = e.beta - tiltCalibrationRef.current.beta;
    const gammaDiff = e.gamma - tiltCalibrationRef.current.gamma;
    
    // Only update if significant change detected to avoid jitter
    if (Math.abs(betaDiff - lastOrientation.beta) > 2 || 
        Math.abs(gammaDiff - lastOrientation.gamma) > 2) {
      
      // Update last orientation
      setLastOrientation({ beta: betaDiff, gamma: gammaDiff });
      
      // Call the callback if provided
      if (onTiltChange) {
        onTiltChange(betaDiff, gammaDiff);
      }
    }
  };

  const calibrateTilt = () => {
    // Get current orientation as calibration point
    window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        tiltCalibrationRef.current = { 
          beta: e.beta, 
          gamma: e.gamma 
        };
        toast.success('Tilt control calibrated');
      }
    }, { once: true });
  };

  const startTiltControl = () => {
    window.addEventListener('deviceorientation', handleOrientation);
    orientationRef.current = 1;
    setIsTiltActive(true);
    calibrateTilt();
    toast.success('Tilt control active: Tilt your device to control playback');
  };

  const stopTiltControl = () => {
    if (orientationRef.current) {
      window.removeEventListener('deviceorientation', handleOrientation);
      orientationRef.current = null;
    }
    setIsTiltActive(false);
    toast.info('Tilt control disabled');
  };

  // Toggle tilt control function
  const toggleTiltControl = async () => {
    try {
      if (!isTiltActive) {
        // Check if the browser supports DeviceOrientationEvent
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
          // Modern browsers require permission on iOS 13+
          if ((DeviceOrientationEvent as any).requestPermission && 
              typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            console.log("Requesting device orientation permission");
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            
            if (permissionState === 'granted') {
              startTiltControl();
            } else {
              toast.error('Permission to access device orientation was denied');
            }
          } else {
            // For devices that don't require permission
            startTiltControl();
          }
        } else {
          toast.error('Device orientation is not supported by your browser');
        }
      } else {
        // Disable tilt control
        stopTiltControl();
      }
    } catch (error) {
      console.error('Error accessing device orientation:', error);
      toast.error('Your device or browser may not support tilt control');
    }
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (orientationRef.current) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return {
    isTiltActive,
    lastOrientation,
    calibrateTilt,
    toggleTiltControl
  };
};
