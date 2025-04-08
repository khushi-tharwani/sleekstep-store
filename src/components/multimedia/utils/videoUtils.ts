
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
 * List of reliable video sources for the app
 */
export const getReliableVideos = () => {
  return [
    {
      id: "1",
      title: "Running Shoes Close-up",
      description: "A detailed close-up of running shoes, showing the quality craftsmanship and materials.",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "0:49"
    },
    {
      id: "2",
      title: "Morning Jog in the Park",
      description: "Experience the serenity of a morning jog through a beautiful park setting.",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "9:56"
    },
    {
      id: "3",
      title: "Product Feature Overview",
      description: "Learn about the innovative features that make our products stand out from the competition.",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "10:53"
    },
    {
      id: "4",
      title: "Training Session Highlights",
      description: "Watch highlights from our professional training sessions and get inspired for your next workout.",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnail: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "12:14"
    },
    {
      id: "5",
      title: "Customer Testimonials",
      description: "Hear what our satisfied customers have to say about their experiences with our products.",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnail: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "10:00"
    },
    {
      id: "6",
      title: "Behind the Scenes",
      description: "Get an exclusive look behind the scenes at our design and manufacturing process.",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "0:59"
    }
  ];
};
