
import React, { useEffect, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  transitionSpeed?: number;
  gyroscopeEnabled?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
  scale = 1.05,
  transitionSpeed = 400,
  gyroscopeEnabled = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const initialOrientation = useRef<{ beta: number | null, gamma: number | null }>({ beta: null, gamma: null });
  const orientationHandlerRef = useRef<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let isInside = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isInside || !cardRef.current) return;
      
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const tiltX = (y - centerY) / (height / 2) * maxTilt;
      const tiltY = -((x - centerX) / (width / 2)) * maxTilt;
      
      card.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    const handleMouseEnter = () => {
      if (!gyroscopeEnabled) {
        isInside = true;
        card.style.transition = `transform ${transitionSpeed}ms cubic-bezier(.03,.98,.52,.99)`;
        setTimeout(() => {
          if (card && isMounted.current) {
            card.style.transition = '';
          }
        }, transitionSpeed);
      }
    };

    const handleMouseLeave = () => {
      if (!gyroscopeEnabled) {
        isInside = false;
        card.style.transition = `transform ${transitionSpeed}ms cubic-bezier(.03,.98,.52,.99)`;
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!card || !isMounted.current || !gyroscopeEnabled) return;
      
      // Only apply tilt effect if device has orientation data
      if (e.beta === null || e.gamma === null) return;
      
      // Calibrate on first reading if not yet set
      if (initialOrientation.current.beta === null || initialOrientation.current.gamma === null) {
        initialOrientation.current = { beta: e.beta, gamma: e.gamma };
        return; // Skip the first reading to get calibrated
      }
      
      // Calculate relative tilt from initial position
      const relativeBeta = e.beta - initialOrientation.current.beta;
      const relativeGamma = e.gamma - initialOrientation.current.gamma;
      
      // Convert relative device orientation to tilt values with increased sensitivity
      const tiltX = Math.min(Math.max(relativeBeta / 45 * maxTilt, -maxTilt), maxTilt);
      const tiltY = Math.min(Math.max(relativeGamma / 45 * maxTilt, -maxTilt), maxTilt);
      
      // Apply smoother tilt effect
      card.style.transition = 'transform 0.2s ease-out';
      card.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };
    
    // Handle motion events for devices that might handle them better than orientation
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (!card || !isMounted.current || !gyroscopeEnabled) return;
      
      const acceleration = e.accelerationIncludingGravity;
      if (!acceleration || acceleration.x === null || acceleration.y === null) return;
      
      // Some devices work better with motion events instead of orientation
      // We can use the acceleration as supplementary data for smoother movement
      
      // This implementation only handles motion as a supplement to orientation
      // for smoother transitions, not as the primary control
    };

    // Set up calibration reset on significant orientation change
    const resetCalibration = () => {
      initialOrientation.current = { beta: null, gamma: null };
    };

    // Add event listeners
    if (!gyroscopeEnabled) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    }
    
    if (gyroscopeEnabled) {
      const setupOrientationHandler = () => {
        if (orientationHandlerRef.current) {
          window.removeEventListener('deviceorientation', handleDeviceOrientation);
        }
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        orientationHandlerRef.current = 1;
        
        // Also listen for motion for better response on some devices
        window.addEventListener('devicemotion', handleDeviceMotion);
        
        // Reset calibration on screen orientation change
        window.addEventListener('orientationchange', resetCalibration);
      };
      
      // Try to request permission on iOS
      if ((DeviceOrientationEvent as any).requestPermission && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              setupOrientationHandler();
            }
          })
          .catch(console.error);
      } else {
        // Direct setup for other browsers
        setupOrientationHandler();
      }
    }

    // Clean up
    return () => {
      isMounted.current = false;
      
      if (!gyroscopeEnabled) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (orientationHandlerRef.current) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
        window.removeEventListener('devicemotion', handleDeviceMotion);
        window.removeEventListener('orientationchange', resetCalibration);
        orientationHandlerRef.current = null;
      }
    };
  }, [maxTilt, perspective, scale, transitionSpeed, gyroscopeEnabled]);

  return (
    <div 
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

export default TiltCard;
