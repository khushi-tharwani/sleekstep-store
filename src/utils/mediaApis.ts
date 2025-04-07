
import { supabase } from "@/integrations/supabase/client";

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: string;
  likes: string;
  comments: string;
  publishedAt: string;
  url: string; // Added URL property for videos
}

export interface ShoeRecommendation {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  imageUrl: string;
  category: string;
  description: string;
  features: string[];
  similarShoes: string[];
}

// YouTube-like video API service
export const videoApiService = {
  async getVideos(query?: string): Promise<VideoData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-video-data', {
        body: { query }
      });
      
      if (error) {
        console.error("Error fetching videos:", error);
        return [];
      }
      
      // Map the response to our interface
      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatYoutubeDuration(item.contentDetails.duration),
        channel: item.snippet.channelTitle,
        views: formatNumber(item.statistics.viewCount),
        likes: formatNumber(item.statistics.likeCount),
        comments: formatNumber(item.statistics.commentCount),
        publishedAt: formatDate(item.snippet.publishedAt),
        url: item.url // Use the URL from the response
      }));
      
    } catch (error) {
      console.error("Error calling video API:", error);
      return [];
    }
  },
  
  async getVideoById(videoId: string): Promise<VideoData | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-video-data', {
        body: { videoId }
      });
      
      if (error || !data.items[0]) {
        console.error("Error fetching video:", error);
        return null;
      }
      
      const item = data.items[0];
      
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatYoutubeDuration(item.contentDetails.duration),
        channel: item.snippet.channelTitle,
        views: formatNumber(item.statistics.viewCount),
        likes: formatNumber(item.statistics.likeCount),
        comments: formatNumber(item.statistics.commentCount),
        publishedAt: formatDate(item.snippet.publishedAt),
        url: item.url // Use the URL from the response
      };
      
    } catch (error) {
      console.error("Error calling video API:", error);
      return null;
    }
  }
};

// Shoe recommendation API service
export const shoeRecommendationService = {
  async getAllRecommendations(): Promise<ShoeRecommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-shoe-recommendations', {
        body: {}
      });
      
      if (error) {
        console.error("Error fetching shoe recommendations:", error);
        return [];
      }
      
      return data.recommendations;
      
    } catch (error) {
      console.error("Error calling shoe API:", error);
      return [];
    }
  },
  
  async getShoeById(shoeId: string): Promise<{
    shoe: ShoeRecommendation,
    similarShoes: ShoeRecommendation[]
  } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-shoe-recommendations', {
        body: { shoeId }
      });
      
      if (error) {
        console.error("Error fetching shoe details:", error);
        return null;
      }
      
      return {
        shoe: data.shoe,
        similarShoes: data.similarRecommendations
      };
      
    } catch (error) {
      console.error("Error calling shoe API:", error);
      return null;
    }
  },
  
  async getRecommendationsByPreferences(preferences: {
    category?: string;
    priceRange?: { min: number; max: number };
    minRating?: number;
    sortBy?: 'price-low' | 'price-high' | 'rating';
  }): Promise<ShoeRecommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-shoe-recommendations', {
        body: { preferences }
      });
      
      if (error) {
        console.error("Error fetching filtered shoe recommendations:", error);
        return [];
      }
      
      return data.recommendations;
      
    } catch (error) {
      console.error("Error calling shoe API:", error);
      return [];
    }
  },
  
  async getPersonalizedRecommendations(userProfile: {
    preferredCategories?: string[];
    recentlyViewed?: string[];
    purchaseHistory?: string[];
  }): Promise<ShoeRecommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-shoe-recommendations', {
        body: { userProfile }
      });
      
      if (error) {
        console.error("Error fetching personalized shoe recommendations:", error);
        return [];
      }
      
      return data.personalizedRecommendations;
      
    } catch (error) {
      console.error("Error calling shoe API:", error);
      return [];
    }
  }
};

// Helper functions
function formatYoutubeDuration(duration: string): string {
  // Convert ISO 8601 duration to readable format
  // Example: "PT1H2M30S" -> "1:02:30"
  
  // Simple implementation for demo purposes
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return "0:00";
  
  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  const seconds = matches[3] ? parseInt(matches[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

function formatNumber(numStr: string): string {
  const num = parseInt(numStr);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return numStr;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
