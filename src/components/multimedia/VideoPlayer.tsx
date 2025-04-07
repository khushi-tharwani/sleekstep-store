
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Compass, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  src: string;
  title?: string;
  autoplay?: boolean;
  poster?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  autoplay = false,
  poster,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTiltActive, setIsTiltActive] = useState(false);
  const [lastOrientation, setLastOrientation] = useState({ beta: 0, gamma: 0 });
  const orientationRef = useRef<number | null>(null);
  const tiltCalibrationRef = useRef({ beta: 0, gamma: 0 });

  // Initialize video on mount
  useEffect(() => {
    if (videoRef.current) {
      if (autoplay) {
        // Try to play the video automatically
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video autoplay started successfully');
              setIsPlaying(true);
            })
            .catch(error => {
              console.log('Autoplay prevented:', error);
              setIsPlaying(false);
            });
        }
      }
    }
  }, [autoplay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Use a user interaction to start playing
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Error playing video:', error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsVideoLoaded(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle video click directly to toggle play/pause
  const handleVideoClick = (e: React.MouseEvent) => {
    // Prevent the click if it's on a control
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    togglePlay();
  };

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
      
      // Use tilt to control video playback
      if (videoRef.current) {
        // Volume control with side tilt (gamma)
        const newVolume = Math.min(Math.max((gammaDiff + 45) / 90, 0), 1);
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        
        // Playback speed control with forward/back tilt (beta)
        // Clamp between 0.5 and 2.0
        const newPlaybackRate = Math.min(Math.max(1 + (betaDiff / 45), 0.5), 2.0);
        videoRef.current.playbackRate = newPlaybackRate;
      }
    }
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
    // Reset playback rate
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }
    setIsTiltActive(false);
    toast.info('Tilt control disabled');
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (orientationRef.current) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div 
        className="relative aspect-video" 
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={(e) => console.error("Video error:", e)}
        />
        
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {!isPlaying && isVideoLoaded && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Play className="h-16 w-16 text-white opacity-80" />
          </div>
        )}
        
        {title && (
          <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4">
            <h3 className="text-white font-medium text-lg">{title}</h3>
          </div>
        )}
        
        {isTiltActive && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            Tilt Control Active
          </div>
        )}
      </div>
      
      <CardContent className="p-3 md:p-4">
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant={isTiltActive ? "destructive" : "ghost"}
                className="h-9 w-9"
                onClick={toggleTiltControl}
                title="Toggle tilt control"
              >
                <Compass className="h-5 w-5" />
              </Button>
              
              {isTiltActive && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  onClick={calibrateTilt}
                  title="Calibrate tilt"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              )}
              
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          {isTiltActive && (
            <div className="mt-2 text-xs text-center text-muted-foreground">
              <p>Tilt left/right: Volume control | Tilt forward/back: Playback speed</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
