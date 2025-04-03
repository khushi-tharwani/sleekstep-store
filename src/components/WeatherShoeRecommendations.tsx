
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Weather {
  location: string;
  temperature: number;
  condition: string;
  icon: React.ReactNode;
}

interface RecommendedShoe {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

const WeatherShoeRecommendations: React.FC = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedShoe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        setLoading(true);
        
        // Get user's geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              fetchWeatherData(latitude, longitude);
            },
            error => {
              console.error("Geolocation error:", error);
              toast({
                title: "Location Access Denied",
                description: "Using default location for weather recommendations.",
                variant: "destructive",
              });
              // Use a default location if geolocation fails
              fetchWeatherData(40.7128, -74.0060); // New York
            }
          );
        } else {
          // Fallback for browsers that don't support geolocation
          fetchWeatherData(40.7128, -74.0060); // New York
        }
      } catch (error) {
        console.error("Error getting user location:", error);
        setLoading(false);
      }
    };
    
    fetchUserLocation();
  }, []);

  // Function to fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      // API key would typically be stored in a secure environment variable
      const API_KEY = 'DEMO_KEY'; // Replace with actual API key in production
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      const data = await response.json();
      
      // Process weather data
      const weatherCondition = data.weather[0].main.toLowerCase();
      let icon;
      
      switch(weatherCondition) {
        case 'clear':
          icon = <Sun className="h-10 w-10 text-yellow-400" />;
          break;
        case 'clouds':
          icon = <Cloud className="h-10 w-10 text-gray-400" />;
          break;
        case 'rain':
        case 'drizzle':
          icon = <CloudRain className="h-10 w-10 text-blue-400" />;
          break;
        case 'snow':
          icon = <CloudSnow className="h-10 w-10 text-blue-200" />;
          break;
        case 'thunderstorm':
          icon = <CloudLightning className="h-10 w-10 text-purple-400" />;
          break;
        default:
          icon = <Cloud className="h-10 w-10 text-gray-400" />;
      }
      
      setWeather({
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon
      });
      
      // Now fetch shoe recommendations based on weather
      fetchShoeRecommendations(weatherCondition);
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
      toast({
        title: "Weather Data Error",
        description: "Failed to fetch current weather. Showing default recommendations.",
        variant: "destructive",
      });
      // Fetch default recommendations
      fetchShoeRecommendations('default');
    }
  };

  // Function to fetch shoe recommendations based on weather
  const fetchShoeRecommendations = async (weatherCondition: string) => {
    try {
      let category;
      
      // Map weather conditions to shoe categories
      switch(weatherCondition) {
        case 'clear':
        case 'clouds':
          category = 'Casual';
          break;
        case 'rain':
        case 'drizzle':
          category = 'Waterproof';
          break;
        case 'snow':
          category = 'Winter';
          break;
        case 'thunderstorm':
          category = 'Boots';
          break;
        default:
          category = 'Casual';
      }
      
      // Fetch products from Supabase based on category
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, category, images')
        .eq('category', category)
        .limit(3);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setRecommendations(data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.images[0] || '/placeholder.svg'
        })));
      } else {
        // Fallback to fetch any products if no matching category
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('products')
          .select('id, name, price, category, images')
          .limit(3);
          
        if (!fallbackError && fallbackData) {
          setRecommendations(fallbackData.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.images[0] || '/placeholder.svg'
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching shoe recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4 mb-2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather-Based Recommendations</span>
          {weather && weather.icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weather && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Current weather in <strong>{weather.location}</strong>: {weather.temperature}°C, {weather.condition}
            </p>
            <p className="text-sm font-medium mt-2">
              Perfect shoes for today's weather:
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map(shoe => (
            <div key={shoe.id} className="group cursor-pointer" onClick={() => navigate(`/product/${shoe.id}`)}>
              <div className="overflow-hidden rounded-md mb-2">
                <img 
                  src={shoe.image} 
                  alt={shoe.name}
                  className="object-cover w-full h-40 transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium">{shoe.name}</h3>
              <p className="text-sm text-muted-foreground">${shoe.price.toFixed(2)} • {shoe.category}</p>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <p className="col-span-3 text-center text-muted-foreground p-4">
              No recommendations available at the moment.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full" onClick={() => navigate('/products')}>
          View all products
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeatherShoeRecommendations;
