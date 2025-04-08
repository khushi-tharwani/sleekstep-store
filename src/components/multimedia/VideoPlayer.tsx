
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import VideoDisplay from './VideoDisplay';
import VideoControls from './VideoControls';
import { useTiltControl } from './hooks/useTiltControl';

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

  // Use the tilt control hook
  const { isTiltActive, lastOrientation, calibrateTilt, toggleTiltControl } = useTiltControl({
    onTiltChange: (betaDiff, gammaDiff) => {
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
  });

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

  return (
    <Card className={`overflow-hidden ${className}`}>
      <VideoDisplay
        videoRef={videoRef}
        src={src}
        poster={poster}
        title={title}
        isPlaying={isPlaying}
        isVideoLoaded={isVideoLoaded}
        isTiltActive={isTiltActive}
        handleVideoClick={handleVideoClick}
        handleTimeUpdate={handleTimeUpdate}
        handleLoadedMetadata={handleLoadedMetadata}
      />
      
      <CardContent className="p-3 md:p-4">
        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          isTiltActive={isTiltActive}
          togglePlay={togglePlay}
          toggleMute={toggleMute}
          toggleFullscreen={toggleFullscreen}
          toggleTiltControl={toggleTiltControl}
          calibrateTilt={calibrateTilt}
          handleSeek={handleSeek}
          handleVolumeChange={handleVolumeChange}
        />
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
