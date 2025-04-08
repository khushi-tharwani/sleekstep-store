
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Compass, RotateCcw } from 'lucide-react';
import { formatTime } from './utils/videoUtils';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isTiltActive: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  toggleTiltControl: () => void;
  calibrateTilt: () => void;
  handleSeek: (value: number[]) => void;
  handleVolumeChange: (value: number[]) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  isTiltActive,
  togglePlay,
  toggleMute,
  toggleFullscreen,
  toggleTiltControl,
  calibrateTilt,
  handleSeek,
  handleVolumeChange,
}) => {
  return (
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
  );
};

export default VideoControls;
