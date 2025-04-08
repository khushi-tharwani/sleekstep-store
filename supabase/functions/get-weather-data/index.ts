
// This edge function retrieves weather data for specific locations
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// For this example, we'll use a mock implementation
// In a real app, you would call a weather API like OpenWeatherMap
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body to get location
    const { location } = await req.json();
    
    console.log("Received weather data request for location:", location);
    
    // In a real implementation, we would call a weather API here
    // For this example, we'll return mock data for different locations
    
    const mockWeatherData = {
      "Mumbai": {
        current: {
          temp_c: 32,
          temp_f: 89.6,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          },
          humidity: 65,
          wind_kph: 15,
          precip_mm: 0.0,
          feelslike_c: 36.2,
          uv: 8
        },
        location: {
          name: "Mumbai",
          region: "Maharashtra",
          country: "India",
          lat: 19.07,
          lon: 72.88,
          localtime: new Date().toISOString()
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: {
                maxtemp_c: 33.2,
                mintemp_c: 27.5,
                condition: {
                  text: "Partly cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 32.7,
                mintemp_c: 27.1,
                condition: {
                  text: "Moderate rain",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/302.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 32.5,
                mintemp_c: 27.0,
                condition: {
                  text: "Heavy rain",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/308.png"
                }
              }
            }
          ]
        }
      },
      "New Delhi": {
        current: {
          temp_c: 34,
          temp_f: 93.2,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
          },
          humidity: 45,
          wind_kph: 12,
          precip_mm: 0.0,
          feelslike_c: 35.6,
          uv: 9
        },
        location: {
          name: "New Delhi",
          region: "Delhi",
          country: "India",
          lat: 28.61,
          lon: 77.23,
          localtime: new Date().toISOString()
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: {
                maxtemp_c: 35.5,
                mintemp_c: 25.2,
                condition: {
                  text: "Sunny",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 34.8,
                mintemp_c: 24.9,
                condition: {
                  text: "Sunny",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 36.2,
                mintemp_c: 25.7,
                condition: {
                  text: "Partly cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
                }
              }
            }
          ]
        }
      },
      "default": {
        current: {
          temp_c: 28,
          temp_f: 82.4,
          condition: {
            text: "Cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/119.png"
          },
          humidity: 60,
          wind_kph: 10,
          precip_mm: 0.0,
          feelslike_c: 30.2,
          uv: 6
        },
        location: {
          name: "Unknown",
          region: "Unknown",
          country: "Unknown",
          lat: 0,
          lon: 0,
          localtime: new Date().toISOString()
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: {
                maxtemp_c: 29,
                mintemp_c: 24,
                condition: {
                  text: "Cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/119.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 30,
                mintemp_c: 23,
                condition: {
                  text: "Partly cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 31,
                mintemp_c: 25,
                condition: {
                  text: "Sunny",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                }
              }
            }
          ]
        }
      }
    };
    
    // Return weather data for the requested location or default if not found
    const weatherData = mockWeatherData[location] || mockWeatherData.default;
    
    return new Response(JSON.stringify(weatherData), {
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
