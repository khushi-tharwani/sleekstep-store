
// This edge function retrieves video data from YouTube Data API
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define response type for the video data
interface YoutubeVideoResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        high: { url: string; width: number; height: number };
      };
      channelTitle: string;
    };
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
  }[];
}

// For this example, we'll use a mock implementation since we don't want to require API keys
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body to get search query or video ID
    const { query, videoId } = await req.json();
    
    console.log("Received request:", { query, videoId });
    
    // In a real implementation, we would call the YouTube API here
    // For this example, we'll return mock data
    
    const mockVideos = [
      {
        id: "video1",
        snippet: {
          title: "How to Choose the Perfect Running Shoes",
          description: "Professional runners share their tips on selecting the right running shoes for your foot type and training needs.",
          publishedAt: "2023-01-15T12:00:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", width: 480, height: 360 },
          },
          channelTitle: "RunnersPro",
        },
        contentDetails: {
          duration: "PT15M33S",
        },
        statistics: {
          viewCount: "245689",
          likeCount: "15789",
          commentCount: "1243",
        },
      },
      {
        id: "video2",
        snippet: {
          title: "Sneaker Cleaning Tutorial - Keep Your Shoes Looking New",
          description: "Learn how to properly clean and maintain different types of athletic shoes to extend their lifespan.",
          publishedAt: "2023-02-23T14:30:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", width: 480, height: 360 },
          },
          channelTitle: "SneakerCare",
        },
        contentDetails: {
          duration: "PT8M12S",
        },
        statistics: {
          viewCount: "178934",
          likeCount: "12453",
          commentCount: "876",
        },
      },
      {
        id: "video3",
        snippet: {
          title: "The History of Athletic Footwear - From Canvas to High Tech",
          description: "Explore the fascinating evolution of sports shoes from simple canvas designs to modern technological marvels.",
          publishedAt: "2022-11-05T09:45:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", width: 480, height: 360 },
          },
          channelTitle: "SneakerHistory",
        },
        contentDetails: {
          duration: "PT22M47S",
        },
        statistics: {
          viewCount: "325678",
          likeCount: "28976",
          commentCount: "2345",
        },
      },
    ];
    
    // If a specific video ID was requested, return just that video
    if (videoId) {
      const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];
      return new Response(JSON.stringify({ items: [video] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // If a search query was provided, filter by it
    let results = mockVideos;
    if (query) {
      results = mockVideos.filter(video => 
        video.snippet.title.toLowerCase().includes(query.toLowerCase()) || 
        video.snippet.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return new Response(JSON.stringify({ items: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
