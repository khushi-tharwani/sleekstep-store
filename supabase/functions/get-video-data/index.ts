
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

// For this example, we'll use a mock implementation
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
    // For this example, we'll return mock data with real video URLs
    
    const mockVideos = [
      {
        id: "video1",
        snippet: {
          title: "Professional Running Shoes Review",
          description: "Professional athletes test and review our latest high-performance running shoes with advanced cushioning technology.",
          publishedAt: "2023-01-15T12:00:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", width: 480, height: 360 },
          },
          channelTitle: "SleekStep Official",
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
          title: "Marathon Training with Premium Cushioned Shoes",
          description: "Professional marathon runner demonstrates proper training techniques using our specialized cushioned running shoes.",
          publishedAt: "2023-02-23T14:30:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", width: 480, height: 360 },
          },
          channelTitle: "SleekStep Pro Training",
        },
        contentDetails: {
          duration: "PT18M45S",
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
          title: "Trail Running Shoe Technology Explained",
          description: "Our head designer explains the technology behind our trail running shoes and how they provide superior grip and stability.",
          publishedAt: "2022-11-05T09:45:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", width: 480, height: 360 },
          },
          channelTitle: "SleekStep Tech",
        },
        contentDetails: {
          duration: "PT12M37S",
        },
        statistics: {
          viewCount: "325678",
          likeCount: "28976",
          commentCount: "2345",
        },
      },
      {
        id: "video4",
        snippet: {
          title: "Cleaning and Maintaining Your Athletic Shoes",
          description: "Expert techniques for cleaning different types of athletic footwear to extend their lifespan and performance.",
          publishedAt: "2022-09-12T15:30:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1556906781-9a412961c28c", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1556906781-9a412961c28c", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1556906781-9a412961c28c", width: 480, height: 360 },
          },
          channelTitle: "Shoe Care Experts",
        },
        contentDetails: {
          duration: "PT8M53S",
        },
        statistics: {
          viewCount: "198765",
          likeCount: "15432",
          commentCount: "987",
        },
      },
      {
        id: "video5",
        snippet: {
          title: "SleekStep Pro - Behind the Design",
          description: "Go behind the scenes with our design team as they share the inspiration and technology behind our flagship SleekStep Pro model.",
          publishedAt: "2023-03-28T10:15:00Z",
          thumbnails: {
            default: { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa", width: 120, height: 90 },
            medium: { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa", width: 320, height: 180 },
            high: { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa", width: 480, height: 360 },
          },
          channelTitle: "SleekStep Design",
        },
        contentDetails: {
          duration: "PT14M22S",
        },
        statistics: {
          viewCount: "287654",
          likeCount: "19876",
          commentCount: "1543",
        },
      },
    ];
    
    // Add real playable video URLs to each video
    const videoUrls = [
      "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-runner-tying-the-laces-of-his-shoes-4831-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-jogger-stretching-before-exercise-on-a-forest-road-4808-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-young-man-tying-shoelaces-before-jogging-4825-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-young-woman-exercising-and-stretching-her-legs-34882-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-park-4830-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-woman-running-in-slow-motion-on-a-track-32809-large.mp4"
    ];
    
    // Assign real URLs to each video
    mockVideos.forEach((video, index) => {
      video.url = videoUrls[index % videoUrls.length];
    });
    
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
