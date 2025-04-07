
// This edge function simulates a product recommendation API for shoes
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for shoe recommendations
interface ShoeRecommendation {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request to get preferences or specific shoe info
    const { preferences, shoeId, userProfile } = await req.json();
    
    console.log("Received request:", { preferences, shoeId, userProfile });
    
    // Mock recommendations database
    const shoeRecommendations: ShoeRecommendation[] = [
      {
        id: "shoe1",
        name: "UltraBoost Pro",
        brand: "SleekStep",
        price: 129.99,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "Running",
        description: "Designed for professional runners with advanced cushioning and support.",
        features: ["Responsive cushioning", "Breathable upper", "Durable outsole", "Lightweight design"],
        similarShoes: ["shoe4", "shoe7"]
      },
      {
        id: "shoe2",
        name: "AirWalk Casual",
        brand: "SleekStep",
        price: 89.99,
        rating: 4.5,
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
        category: "Casual",
        description: "Perfect for everyday wear with stylish design and comfort features.",
        features: ["Memory foam insole", "Classic design", "All-day comfort", "Flexible construction"],
        similarShoes: ["shoe5", "shoe8"]
      },
      {
        id: "shoe3",
        name: "TrailMaster X",
        brand: "SleekStep",
        price: 149.99,
        rating: 4.7,
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
        category: "Hiking",
        description: "Rugged trail shoes with superior grip and water resistance for outdoor adventures.",
        features: ["Waterproof membrane", "Aggressive tread pattern", "Rock protection plate", "Supportive ankle collar"],
        similarShoes: ["shoe6", "shoe9"]
      },
      {
        id: "shoe4",
        name: "SpeedRacer Elite",
        brand: "SleekStep",
        price: 159.99,
        rating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        category: "Running",
        description: "Competition-grade running shoes designed for marathons and speed training.",
        features: ["Carbon fiber plate", "Energy-return foam", "Featherweight construction", "Aerodynamic design"],
        similarShoes: ["shoe1", "shoe7"]
      },
      {
        id: "shoe5",
        name: "UrbanStyle Lite",
        brand: "SleekStep",
        price: 79.99,
        rating: 4.3,
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
        category: "Casual",
        description: "Trendy urban sneakers that combine style with all-day comfort.",
        features: ["Minimalist design", "Eco-friendly materials", "Cushioned footbed", "Versatile styling"],
        similarShoes: ["shoe2", "shoe8"]
      },
      {
        id: "shoe6",
        name: "AlpineXplorer",
        brand: "SleekStep",
        price: 169.99,
        rating: 4.6,
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
        category: "Hiking",
        description: "Premium hiking boots for challenging terrains and multi-day treks.",
        features: ["Full ankle support", "Vibram outsole", "Gore-Tex waterproofing", "Temperature regulation"],
        similarShoes: ["shoe3", "shoe9"]
      }
    ];
    
    // If specific shoe ID requested, return that shoe's info
    if (shoeId) {
      const shoe = shoeRecommendations.find(s => s.id === shoeId);
      if (shoe) {
        // Get similar shoes data
        const similarShoes = shoe.similarShoes.map(id => 
          shoeRecommendations.find(s => s.id === id)
        ).filter(s => s !== undefined);
        
        return new Response(JSON.stringify({ 
          shoe,
          similarRecommendations: similarShoes
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        return new Response(JSON.stringify({ 
          error: "Shoe not found" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
      }
    }
    
    // If user preferences were provided, filter recommendations
    if (preferences) {
      let filteredShoes = [...shoeRecommendations];
      
      // Filter by category if provided
      if (preferences.category) {
        filteredShoes = filteredShoes.filter(shoe => 
          shoe.category.toLowerCase() === preferences.category.toLowerCase()
        );
      }
      
      // Filter by price range if provided
      if (preferences.priceRange) {
        const { min, max } = preferences.priceRange;
        filteredShoes = filteredShoes.filter(shoe => 
          shoe.price >= min && shoe.price <= max
        );
      }
      
      // Filter by minimum rating if provided
      if (preferences.minRating) {
        filteredShoes = filteredShoes.filter(shoe => 
          shoe.rating >= preferences.minRating
        );
      }
      
      // Sort results based on preferences
      if (preferences.sortBy) {
        switch (preferences.sortBy) {
          case 'price-low':
            filteredShoes.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredShoes.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredShoes.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
      
      return new Response(JSON.stringify({ 
        recommendations: filteredShoes
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // If we have user profile data, personalize recommendations
    if (userProfile) {
      // In a real implementation, this would use ML algorithms
      // For this demo, we'll just do basic filtering
      let personalizedRecommendations = [...shoeRecommendations];
      
      // Sort based on previous purchases or viewed categories
      if (userProfile.preferredCategories && userProfile.preferredCategories.length > 0) {
        personalizedRecommendations.sort((a, b) => {
          const aMatchesPreferred = userProfile.preferredCategories.includes(a.category);
          const bMatchesPreferred = userProfile.preferredCategories.includes(b.category);
          
          if (aMatchesPreferred && !bMatchesPreferred) return -1;
          if (!aMatchesPreferred && bMatchesPreferred) return 1;
          return 0;
        });
      }
      
      return new Response(JSON.stringify({
        personalizedRecommendations: personalizedRecommendations
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Default: return all recommendations
    return new Response(JSON.stringify({ 
      recommendations: shoeRecommendations
    }), {
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
