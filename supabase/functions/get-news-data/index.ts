
// This edge function retrieves news data for specific topics
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body to get topic
    const { topic } = await req.json();
    
    console.log("Received news data request for topic:", topic);
    
    // Mock news data for different topics
    const mockNewsData = {
      "sports": [
        {
          id: "sports-1",
          title: "Mumbai Marathon Sets New Participation Record",
          summary: "The annual Mumbai Marathon saw over 55,000 participants this year, setting a new record for the event.",
          source: "Sports Daily",
          publishedAt: "2025-04-06T08:30:00Z",
          url: "https://example.com/sports/mumbai-marathon",
          imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: "sports-2",
          title: "New Running Shoe Technology Promises 3% Performance Boost",
          summary: "A revolutionary midsole design in the latest running shoes is showing significant performance improvements in lab tests.",
          source: "Runner's World",
          publishedAt: "2025-04-05T14:15:00Z",
          url: "https://example.com/sports/running-shoe-tech",
          imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: "sports-3",
          title: "Trail Running Championship Comes to Mumbai Hills",
          summary: "The international trail running series announces Mumbai's Sanjay Gandhi National Park as its newest championship location.",
          source: "Trail Runner Magazine",
          publishedAt: "2025-04-04T11:45:00Z",
          url: "https://example.com/sports/trail-championship",
          imageUrl: "https://images.unsplash.com/photo-1640171523901-e10b93acb9b5?q=80&w=2112&auto=format&fit=crop"
        }
      ],
      "technology": [
        {
          id: "tech-1",
          title: "AI-Powered Fitness Coaching App Raises $50M",
          summary: "A startup focusing on AI-based personal training and fitness tracking has secured major funding to expand globally.",
          source: "Tech Crunch",
          publishedAt: "2025-04-07T09:20:00Z",
          url: "https://example.com/tech/ai-fitness-app",
          imageUrl: "https://images.unsplash.com/photo-1510188532307-3a0b6de4b7a5?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: "tech-2",
          title: "New Wearable Measures Running Form in Real-Time",
          summary: "Engineers have developed a lightweight sensor that provides instant feedback on running mechanics to prevent injuries.",
          source: "Wearable Tech Today",
          publishedAt: "2025-04-06T16:40:00Z",
          url: "https://example.com/tech/running-wearable",
          imageUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: "tech-3",
          title: "Smart Insoles Track Foot Strike Patterns with 99% Accuracy",
          summary: "Pressure-sensitive insoles connected to smartphone apps are revolutionizing how runners analyze their gait.",
          source: "Digital Trends",
          publishedAt: "2025-04-05T13:10:00Z",
          url: "https://example.com/tech/smart-insoles",
          imageUrl: "https://images.unsplash.com/photo-1682148569300-bc2479e14341?q=80&w=2070&auto=format&fit=crop"
        }
      ],
      "default": [
        {
          id: "general-1",
          title: "Global Running Day Celebrations Planned Worldwide",
          summary: "Cities around the world prepare for community events to promote running and active lifestyles on Global Running Day.",
          source: "Fitness News",
          publishedAt: "2025-04-07T10:00:00Z",
          url: "https://example.com/general/global-running-day",
          imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: "general-2",
          title: "Study Shows Running Improves Mental Health",
          summary: "New research confirms that regular running can significantly reduce symptoms of anxiety and depression.",
          source: "Health Journal",
          publishedAt: "2025-04-06T12:30:00Z",
          url: "https://example.com/general/running-mental-health",
          imageUrl: "https://images.unsplash.com/photo-1509833903111-9cb142f644e4?q=80&w=2069&auto=format&fit=crop"
        },
        {
          id: "general-3",
          title: "Running Shoe Recycling Program Launches in 10 Countries",
          summary: "A major footwear manufacturer introduces an initiative to recycle old running shoes into playground materials.",
          source: "Eco News",
          publishedAt: "2025-04-05T09:45:00Z",
          url: "https://example.com/general/shoe-recycling",
          imageUrl: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=2079&auto=format&fit=crop"
        }
      ]
    };
    
    // Return news data for the requested topic or default if not found
    const newsData = mockNewsData[topic] || mockNewsData.default;
    
    return new Response(JSON.stringify({ articles: newsData }), {
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
