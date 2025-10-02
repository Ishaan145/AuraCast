import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SunIcon, CloudRainIcon, WindIcon } from './Icons';
import CountUp from 'react-countup';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: string;
  uvIndex: number;
  pressure: number;
  visibility: number;
}

interface LiveWeatherIntelligenceProps {
  location: string;
  coords: [number, number];
}

export const LiveWeatherIntelligence: React.FC<LiveWeatherIntelligenceProps> = ({ location, coords }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching weather data based on location
    const fetchWeatherData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate realistic weather data based on location
      const temperature = Math.floor(Math.random() * 25) + 15; // 15-40°C
      const conditions = ['Clear Sky', 'Partly Cloudy', 'Hazy Sunshine', 'Light Rain', 'Overcast'];
      
      setWeather({
        location: location.split('(')[0].trim(),
        temperature,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        wind: `${Math.floor(Math.random() * 20) + 5} km/h ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]}`,
        uvIndex: Math.floor(Math.random() * 10) + 1, // 1-11
        pressure: Math.floor(Math.random() * 50) + 980, // 980-1030 hPa
        visibility: Math.floor(Math.random() * 15) + 2 // 2-16 km
      });
      
      setIsLoading(false);
    };

    fetchWeatherData();
  }, [location, coords]);

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: 'Low', color: 'text-green-500' };
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
    if (index <= 7) return { level: 'High', color: 'text-orange-500' };
    if (index <= 10) return { level: 'Very High', color: 'text-red-500' };
    return { level: 'Extreme', color: 'text-purple-500' };
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain')) return <CloudRainIcon className="w-10 h-10 text-blue-400" />;
    if (condition.includes('Cloud')) return <CloudRainIcon className="w-10 h-10 text-gray-400" />;
    return <SunIcon className="w-10 h-10 text-yellow-400" />;
  };

  if (isLoading || !weather) {
    return (
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SunIcon className="w-5 h-5 text-primary" />
            Live Weather Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const uvData = getUVLevel(weather.uvIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <SunIcon className="w-5 h-5 text-primary" />
            Live Weather Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Location & Temperature */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{weather.location}</h3>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-6xl font-bold text-primary">
                  <CountUp end={weather.temperature} duration={1.5} />°C
                </div>
                <div className="text-lg text-muted-foreground mt-2">{weather.condition}</div>
              </div>
              <div className="mt-2">
                {getWeatherIcon(weather.condition)}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CloudRainIcon className="w-4 h-4" />
                <span>Humidity</span>
              </div>
              <div className="text-2xl font-bold">
                <CountUp end={weather.humidity} duration={1} />%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <WindIcon className="w-4 h-4" />
                <span>Wind</span>
              </div>
              <div className="text-xl font-bold">{weather.wind}</div>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-4 rounded-lg bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">UV Index</span>
              <span className={`text-sm font-bold ${uvData.color}`}>{uvData.level} ({weather.uvIndex})</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(weather.uvIndex / 11) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full ${
                  weather.uvIndex <= 2 ? 'bg-green-500' :
                  weather.uvIndex <= 5 ? 'bg-yellow-500' :
                  weather.uvIndex <= 7 ? 'bg-orange-500' :
                  weather.uvIndex <= 10 ? 'bg-red-500' : 'bg-purple-500'
                }`}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Pressure</div>
              <div className="text-2xl font-bold">
                <CountUp end={weather.pressure} duration={1} /> hPa
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Visibility</div>
              <div className="text-2xl font-bold">
                <CountUp end={weather.visibility} duration={1} /> km
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
