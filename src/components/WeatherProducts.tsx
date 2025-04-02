
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Sun, CloudRain, Cloud, CloudSnow, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
}

interface WeatherProductProps {
  className?: string;
}

const WeatherProducts: React.FC<WeatherProductProps> = ({ className }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const apiKey = '0d4f18051b8243840c949e12c0193fad'; // OpenWeatherMap free API key

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city) {
      toast({
        title: "Please enter a city",
        description: "Enter a city name to get weather-based product suggestions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeatherData(data);
      generateRecommendations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find weather data for this city. Please check the name and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (data: WeatherData) => {
    const temp = data.main.temp;
    const weatherCondition = data.weather[0].main.toLowerCase();
    
    let recommendations = [];
    
    // Based on temperature
    if (temp < 5) {
      recommendations.push('Insulated winter boots');
      recommendations.push('Warm hiking shoes');
    } else if (temp < 15) {
      recommendations.push('Waterproof casual shoes');
      recommendations.push('Comfortable loafers');
    } else if (temp < 25) {
      recommendations.push('Lightweight sneakers');
      recommendations.push('Casual canvas shoes');
    } else {
      recommendations.push('Breathable sandals');
      recommendations.push('Flip flops');
    }
    
    // Based on weather condition
    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      recommendations.push('Waterproof rubber boots');
      recommendations.push('Water-resistant sneakers');
    } else if (weatherCondition.includes('snow')) {
      recommendations.push('Snow boots with good grip');
      recommendations.push('Insulated waterproof boots');
    } else if (weatherCondition.includes('clear')) {
      recommendations.push('Lightweight running shoes');
      recommendations.push('UV-protective footwear');
    }
    
    setRecommendations(recommendations);
  };

  const getWeatherIcon = () => {
    if (!weatherData) return null;
    
    const condition = weatherData.weather[0].main.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className="h-10 w-10 text-blue-400" />;
    } else if (condition.includes('snow')) {
      return <CloudSnow className="h-10 w-10 text-blue-200" />;
    } else if (condition.includes('cloud')) {
      return <Cloud className="h-10 w-10 text-gray-400" />;
    } else {
      return <Sun className="h-10 w-10 text-yellow-400" />;
    }
  };

  return (
    <div className={className}>
      <TiltCard className="mb-6">
        <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white border-white/10">
          <CardHeader>
            <CardTitle>Weather-Based Shoe Recommendations</CardTitle>
            <CardDescription className="text-blue-200">
              We'll suggest the perfect footwear based on your local weather
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button disabled={loading} type="submit">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Suggestions"}
              </Button>
            </form>

            {weatherData && (
              <div className="mt-6 bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold">{weatherData.name}</h4>
                    <p className="text-sm text-blue-200">{weatherData.weather[0].description}</p>
                  </div>
                  <div className="flex items-center">
                    {getWeatherIcon()}
                    <span className="text-2xl ml-2">{Math.round(weatherData.main.temp)}°C</span>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recommended Footwear:</h4>
                    <ul className="space-y-2">
                      {recommendations.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-300 mr-2"></span>
                          <Link to="/products" className="hover:underline">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TiltCard>
    </div>
  );
};

export default WeatherProducts;
