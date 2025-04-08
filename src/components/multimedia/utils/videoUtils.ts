
// Helper functions for the video player component

/**
 * Format seconds into MM:SS display format
 */
export const formatTime = (time: number): string => {
  if (isNaN(time)) return "0:00";
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Format hours, minutes, seconds into display format
 */
export const formatDuration = (hours: number, minutes: number, seconds: number): string => {
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Format YouTube ISO 8601 duration to readable format
 */
export const formatYoutubeDuration = (duration: string): string => {
  // Convert ISO 8601 duration to readable format
  // Example: "PT1H2M30S" -> "1:02:30"
  
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return "0:00";
  
  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  const seconds = matches[3] ? parseInt(matches[3]) : 0;
  
  return formatDuration(hours, minutes, seconds);
};

/**
 * Convert seconds to human-readable duration
 */
export const secondsToReadableDuration = (totalSeconds: number): string => {
  if (isNaN(totalSeconds)) return "0:00";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return formatDuration(hours, minutes, seconds);
};

/**
 * Extract video ID from various YouTube URL formats
 */
export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Check if a video URL is valid and accessible
 */
export const isVideoUrlValid = (url: string): boolean => {
  if (!url) return false;
  
  // Check for common video file extensions
  const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const hasValidExtension = validExtensions.some(ext => url.toLowerCase().includes(ext));
  
  // Check for common video hosting domains
  const validHosts = ['mixkit.co', 'assets.mixkit.co', 'videos.pexels.com', 'player.vimeo.com'];
  const hasValidHost = validHosts.some(host => url.toLowerCase().includes(host));
  
  return hasValidExtension || hasValidHost;
};

/**
 * Get a fallback video URL if the main one fails
 */
export const getFallbackVideoUrl = (): string => {
  const fallbackUrls = [
    'https://assets.mixkit.co/videos/preview/mixkit-runner-tying-the-laces-of-his-shoes-4831-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-young-man-tying-shoelaces-before-jogging-4825-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-jogger-stretching-before-exercise-on-a-forest-road-4808-large.mp4'
  ];
  
  return fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];
};
