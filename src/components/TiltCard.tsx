
import React, { useEffect, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  transitionSpeed?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
  scale = 1.05,
  transitionSpeed = 400,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

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
      isInside = true;
      card.style.transition = `transform ${transitionSpeed}ms cubic-bezier(.03,.98,.52,.99)`;
      setTimeout(() => {
        if (card && isMounted.current) {
          card.style.transition = '';
        }
      }, transitionSpeed);
    };

    const handleMouseLeave = () => {
      isInside = false;
      card.style.transition = `transform ${transitionSpeed}ms cubic-bezier(.03,.98,.52,.99)`;
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!card || !isMounted.current) return;
      
      // Only apply tilt effect if device has orientation data
      if (e.beta === null || e.gamma === null) return;
      
      // Convert device orientation to tilt values
      const tiltX = Math.min(Math.max((e.beta - 45) / 90 * maxTilt, -maxTilt), maxTilt);
      const tiltY = Math.min(Math.max(e.gamma / 45 * maxTilt, -maxTilt), maxTilt);
      
      card.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    // Add event listeners
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    // Clean up
    return () => {
      isMounted.current = false;
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [maxTilt, perspective, scale, transitionSpeed]);

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
