
import React from 'react';
import { Play } from 'lucide-react';

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  src: string;
  poster?: string;
  title?: string;
  isPlaying: boolean;
  isVideoLoaded: boolean;
  isTiltActive: boolean;
  handleVideoClick: (e: React.MouseEvent) => void;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  videoRef,
  src,
  poster,
  title,
  isPlaying,
  isVideoLoaded,
  isTiltActive,
  handleVideoClick,
  handleTimeUpdate,
  handleLoadedMetadata,
}) => {
  return (
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
        onEnded={() => {
          // This will be handled by the parent component
        }}
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
  );
};

export default VideoDisplay;
