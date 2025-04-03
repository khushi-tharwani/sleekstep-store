
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { latitude, longitude } = await req.json()
    
    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Missing location data' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
    
    // Get weather data from Open Weather Map API
    const WEATHER_API_KEY = Deno.env.get('OPEN_WEATHER_API_KEY') || 'DEMO_KEY'
    
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'DEMO_KEY') {
      console.log("Weather API key not properly configured, using mock data")
      // Return mock data if no API key is configured
      return new Response(
        JSON.stringify({
          weather: {
            location: 'New York',
            temperature: 25,
            condition: 'Clear',
            description: 'clear sky',
            icon: '01d'
          },
          recommendations: [
            {
              id: 'rec1',
              name: 'Summer Runner',
              price: 129.99,
              category: 'Casual',
              image: '/placeholder.svg'
            },
            {
              id: 'rec2',
              name: 'Urban Walker',
              price: 99.99,
              category: 'Casual',
              image: '/placeholder.svg'
            },
            {
              id: 'rec3',
              name: 'Street Classic',
              price: 149.99,
              category: 'Casual',
              image: '/placeholder.svg'
            }
          ]
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    console.log(`Fetching weather data for lat:${latitude}, lon:${longitude} with API key: ${WEATHER_API_KEY.substring(0, 3)}...`)
    
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
    )
    
    if (!weatherResponse.ok) {
      console.error(`Weather API error: ${weatherResponse.status}`)
      throw new Error(`Weather API error: ${weatherResponse.status}`)
    }
    
    const weatherData = await weatherResponse.json()
    
    // Connect to Supabase to get product recommendations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    // Map weather conditions to shoe categories
    let category = 'Casual'
    const weatherCondition = weatherData.weather[0].main.toLowerCase()
    
    switch(weatherCondition) {
      case 'clear':
      case 'clouds':
        category = 'Casual'
        break
      case 'rain':
      case 'drizzle':
        category = 'Waterproof'
        break
      case 'snow':
        category = 'Winter'
        break
      case 'thunderstorm':
        category = 'Boots'
        break
    }
    
    // Get product recommendations
    const { data: products, error } = await supabaseClient
      .from('products')
      .select('id, name, price, category, images')
      .eq('category', category)
      .limit(3)
    
    if (error) {
      console.error('Error fetching product recommendations:', error)
      throw error
    }
    
    // If no products found in specific category, get any products
    let recommendations = products
    if (!products || products.length === 0) {
      console.log('No products found in category, fetching fallback products')
      const { data: fallbackProducts, error: fallbackError } = await supabaseClient
        .from('products')
        .select('id, name, price, category, images')
        .limit(3)
      
      if (!fallbackError && fallbackProducts) {
        recommendations = fallbackProducts
      } else {
        // Use mock recommendations as last resort
        recommendations = [
          {
            id: 'rec1',
            name: 'Summer Runner',
            price: 129.99,
            category: 'Casual',
            image: '/placeholder.svg'
          },
          {
            id: 'rec2',
            name: 'Urban Walker',
            price: 99.99,
            category: 'Casual',
            image: '/placeholder.svg'
          },
          {
            id: 'rec3',
            name: 'Street Classic',
            price: 149.99,
            category: 'Casual',
            image: '/placeholder.svg'
          }
        ]
      }
    }
    
    return new Response(
      JSON.stringify({
        weather: {
          location: weatherData.name,
          temperature: Math.round(weatherData.main.temp),
          condition: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon
        },
        recommendations: recommendations?.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: (product.images && product.images.length > 0) ? product.images[0] : '/placeholder.svg'
        })) || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in weather-api function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        mockData: {
          weather: {
            location: 'New York',
            temperature: 25,
            condition: 'Clear',
            description: 'clear sky',
            icon: '01d'
          },
          recommendations: [
            {
              id: 'rec1',
              name: 'Summer Runner',
              price: 129.99,
              category: 'Casual',
              image: '/placeholder.svg'
            },
            {
              id: 'rec2',
              name: 'Urban Walker',
              price: 99.99,
              category: 'Casual',
              image: '/placeholder.svg'
            },
            {
              id: 'rec3',
              name: 'Street Classic',
              price: 149.99,
              category: 'Casual',
              image: '/placeholder.svg'
            }
          ]
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 even on error but with mock data
      }
    )
  }
})
