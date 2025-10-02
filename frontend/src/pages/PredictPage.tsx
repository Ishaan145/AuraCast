import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { LocationIcon, RouteIcon, ScanIcon, SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertIcon, TrendingUpIcon, TrendingDownIcon, CalendarIcon, DatabaseIcon, AlertTriangleIcon } from '../components/Icons';
import { MOCK_DATA, calculateActivityRisk, getRiskColor, getRiskLevel } from '../lib/mockData';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';
import { LocationInput } from '../components/LocationInput';
import { InteractiveMap } from '../components/InteractiveMap';
import { LiveWeatherIntelligence } from '../components/LiveWeatherIntelligence';
import { AlternativeDateSuggestions } from '../components/AlternativeDateSuggestions';
import { NaturalLanguageQuery } from '../components/NaturalLanguageQuery';
import { TripTracker } from '../components/TripTracker';
import CountUp from 'react-countup';

interface LocationData {
  name: string;
  coords: [number, number];
  risk: number;
  weather?: {
    temp: string;
    condition: string;
    humidity: string;
    wind: string;
  };
}

interface PredictionResult {
  type: 'single' | 'nearby' | 'travel';
  data: any;
  locations: LocationData[];
  travelRoute?: [number, number][];
}

const PredictPage = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [activeMode, setActiveMode] = useState<'single' | 'nearby' | 'travel'>('single');
  const [location, setLocation] = useState('New Delhi, India');
  const [locationCoords, setLocationCoords] = useState<[number, number]>([28.7041, 77.1025]);
  const [date, setDate] = useState('2025-01-15');
  const [activity, setActivity] = useState('hiking');
  const [startLocation, setStartLocation] = useState('New Delhi, India');
  const [startCoords, setStartCoords] = useState<[number, number]>([28.7041, 77.1025]);
  const [endLocation, setEndLocation] = useState('Tokyo, Japan');
  const [endCoords, setEndCoords] = useState<[number, number]>([35.6762, 139.6503]);
  const [scanRadius, setScanRadius] = useState('50');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationDetecting, setIsLocationDetecting] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [mlConfidence, setMlConfidence] = useState(85);
  const [eventType, setEventType] = useState('outdoor-event');
  const [timeWindow, setTimeWindow] = useState('24-hours');

  // Removed auto-prediction on load - user must click Scan/Predict button

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <WeatherAnimatedBackground />
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">Please log in to access the Prediction tool.</p>
          <Button onClick={() => navigate('login')} className="bg-gradient-primary w-full sm:w-auto">
            Login
          </Button>
        </div>
      </div>
    );
  }

  const handlePrediction = async () => {
    setIsLoading(true);
    setPrediction(null);
    setMlConfidence(Math.floor(Math.random() * 15) + 80); // 80-95% confidence

    // Simulate advanced ML model processing with multiple stages
    await new Promise(resolve => setTimeout(resolve, 3000));

    let result: PredictionResult;

    if (activeMode === 'single') {
      const locationKey = location.split(' (')[0];
      const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                      MOCK_DATA.weatherData["New Delhi, India"];
      
      const activityProfile = MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles];
      const adjustedRisk = calculateActivityRisk(baseData.factors, activityProfile.weights);
      
      result = {
        type: 'single',
        data: {
          ...baseData,
          overall: adjustedRisk,
          activity: activityProfile.name,
          activityDescription: activityProfile.description,
          recommendations: [
            `Optimal timing: ${adjustedRisk < 40 ? 'Early morning (6-10 AM) or late afternoon (5-7 PM)' : 'Mid-morning (9-11 AM) with backup indoor options'}`,
            `Event duration: ${adjustedRisk > 70 ? 'Maximum 2 hours with frequent breaks' : adjustedRisk > 40 ? '4-6 hours with weather monitoring' : 'Full day event possible with standard precautions'}`,
            `Weather alerts: Monitor conditions ${adjustedRisk > 60 ? 'every 30 minutes' : 'every 2-3 hours'} leading up to event`,
            `Equipment needed: ${adjustedRisk > 50 ? 'Weather-resistant gear, emergency shelter, first aid kit' : 'Standard outdoor equipment with light rain protection'}`,
            `Backup plan: ${adjustedRisk > 60 ? 'Indoor venue ready, weather contingency plan activated' : 'Monitor forecast 48 hours prior'}`
          ],
          historicalAverage: Math.max(10, adjustedRisk - Math.floor(Math.random() * 20)),
          mlModelVersion: 'AuraCast-v2.1',
          dataSourcesCount: 12,
          processedDataPoints: Math.floor(Math.random() * 500000) + 100000,
          eventSuccess: adjustedRisk < 30 ? 'Very High (92%)' : adjustedRisk < 50 ? 'High (78%)' : adjustedRisk < 70 ? 'Moderate (55%)' : 'Low (32%)',
          adverseWeatherProbability: {
            rain: Math.max(0, baseData.factors.wet - 20 + Math.random() * 40),
            strongWind: Math.max(0, baseData.factors.windy - 15 + Math.random() * 30),
            extremeTemp: Math.max(0, (baseData.factors.hot + baseData.factors.cold) / 2 - 10 + Math.random() * 20),
            overallDiscomfort: adjustedRisk
          }
        },
        locations: [{
          name: locationKey,
          coords: locationCoords,
          risk: adjustedRisk,
          weather: {
            temp: `${Math.floor(Math.random() * 15) + 20}°C`,
            condition: baseData.factors.wet > 60 ? 'Rainy' : baseData.factors.hot > 70 ? 'Hot' : 'Clear',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            wind: `${Math.floor(Math.random() * 20) + 5} km/h`
          }
        }]
      };
    } else if (activeMode === 'nearby') {
      const locationKey = location.split(' (')[0];
      const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                      MOCK_DATA.weatherData["New Delhi, India"];
      
      const activityProfile = MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles];
      const centerRisk = calculateActivityRisk(baseData.factors, activityProfile.weights);
      
      // Generate nearby locations with varied risks
      const nearbyLocations: LocationData[] = [
        {
          name: locationKey,
          coords: locationCoords,
          risk: centerRisk,
          weather: {
            temp: `${Math.floor(Math.random() * 15) + 20}°C`,
            condition: 'Clear',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            wind: `${Math.floor(Math.random() * 20) + 5} km/h`
          }
        }
      ];

      // Add surrounding locations
      const radiusKm = parseInt(scanRadius);
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * (Math.PI / 180);
        const offsetLat = (radiusKm / 111) * Math.cos(angle);
        const offsetLng = (radiusKm / (111 * Math.cos(locationCoords[0] * Math.PI / 180))) * Math.sin(angle);
        
        nearbyLocations.push({
          name: `Area ${i + 1}`,
          coords: [locationCoords[0] + offsetLat, locationCoords[1] + offsetLng],
          risk: Math.max(5, Math.min(95, centerRisk + (Math.random() - 0.5) * 40)),
          weather: {
            temp: `${Math.floor(Math.random() * 10) + 22}°C`,
            condition: Math.random() > 0.7 ? 'Cloudy' : 'Clear',
            humidity: `${Math.floor(Math.random() * 20) + 55}%`,
            wind: `${Math.floor(Math.random() * 15) + 8} km/h`
          }
        });
      }

      result = {
        type: 'nearby',
        data: {
          ...baseData,
          overall: centerRisk,
          activity: activityProfile.name,
          activityDescription: activityProfile.description,
          scanRadius: radiusKm
        },
        locations: nearbyLocations
      };
    } else {
      // Travel mode
      const routeKey = `${startLocation.split(' (')[0]} to ${endLocation.split(' (')[0]}`;
      const travelData = MOCK_DATA.travelRoutes[routeKey as keyof typeof MOCK_DATA.travelRoutes] || 
                        MOCK_DATA.travelRoutes["New Delhi, India to Tokyo, Japan"];
      
      const waypoints: LocationData[] = [
        {
          name: `Start: ${startLocation.split(' (')[0]}`,
          coords: startCoords,
          risk: 65,
          weather: { temp: '28°C', condition: 'Clear', humidity: '68%', wind: '12 km/h' }
        },
        {
          name: `End: ${endLocation.split(' (')[0]}`,
          coords: endCoords,
          risk: 45,
          weather: { temp: '22°C', condition: 'Partly Cloudy', humidity: '72%', wind: '18 km/h' }
        }
      ];

      result = {
        type: 'travel',
        data: {
          ...travelData,
          startLocation: startLocation.split(' (')[0],
          endLocation: endLocation.split(' (')[0],
          totalDistance: '6,200 km',
          estimatedTime: '8h 45m flight',
          averageRisk: 55
        },
        locations: waypoints,
        travelRoute: [startCoords, endCoords]
      };
    }

    setPrediction(result);
    setIsLoading(false);
  };

  const handleLocationDetection = async () => {
    setIsLocationDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setLocation(locationString);
          setLocationCoords([latitude, longitude]);
          setIsLocationDetecting(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location
          setLocation('New Delhi, India (28.7041, 77.1025)');
          setLocationCoords([28.7041, 77.1025]);
          setIsLocationDetecting(false);
        }
      );
    } else {
      // Simulate geolocation for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLocation('New Delhi, India (28.7041, 77.1025)');
      setLocationCoords([28.7041, 77.1025]);
      setIsLocationDetecting(false);
    }
  };

  const handleLocationChange = (value: string, coords?: [number, number]) => {
    if (activeMode === 'travel') {
      // Handle travel mode location changes separately
      return;
    }
    setLocation(value);
    if (coords) {
      setLocationCoords(coords);
    }
  };

  const handleStartLocationChange = (value: string, coords?: [number, number]) => {
    setStartLocation(value);
    if (coords) {
      setStartCoords(coords);
    }
  };

  const handleEndLocationChange = (value: string, coords?: [number, number]) => {
    setEndLocation(value);
    if (coords) {
      setEndCoords(coords);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'single': return LocationIcon;
      case 'nearby': return ScanIcon;
      case 'travel': return RouteIcon;
      default: return LocationIcon;
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'single': return 'Analyze risk for a specific location and activity';
      case 'nearby': return 'Compare risks across nearby locations within a radius';
      case 'travel': return 'Assess weather risks along your travel route';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-12">
      <WeatherAnimatedBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6 lg:mb-10"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 flex items-center gap-2 w-fit mx-auto">
            <DatabaseIcon className="w-4 h-4" />
            NASA Space Apps Challenge · Advanced Climate Intelligence
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 lg:mb-5">
            Will It Rain On My Parade?
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            AI-powered weather risk prediction with Natural Language Processing · Voice Commands · Real-time Trip Tracking · Emergency Assistance
          </p>
          
          {/* Natural Language Query */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-6"
          >
            <NaturalLanguageQuery
              onQueryParsed={(parsed) => {
                if (parsed.location) setLocation(parsed.location);
                if (parsed.coords) setLocationCoords(parsed.coords);
                if (parsed.date) setDate(parsed.date);
                if (parsed.activity) setActivity(parsed.activity);
                // Auto-trigger prediction after voice/NLP query
                setTimeout(() => handlePrediction(), 500);
              }}
            />
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mt-4 lg:mt-6">
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <DatabaseIcon className="w-3 h-3" />
              ML Confidence: {mlConfidence}%
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <LocationIcon className="w-3 h-3" />
              Global Coverage
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <TrendingUpIcon className="w-3 h-3" />
              Real-time Analysis
            </Badge>
          </div>
        </motion.div>

        {/* Responsive grid layout: Control Panel + Map + Weather Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Control Panel - Left Column */}
          <div className="lg:col-span-4 space-y-4">{/* ... keep existing code */}
            <Card className="glass overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {React.createElement(getModeIcon(activeMode), { className: "w-4 h-4 text-primary" })}
                  </div>
                  Risk Analysis Mode
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {getModeDescription(activeMode)}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="single" className="flex items-center gap-2">
                      <LocationIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Single</span>
                    </TabsTrigger>
                    <TabsTrigger value="nearby" className="flex items-center gap-2">
                      <ScanIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Nearby</span>
                    </TabsTrigger>
                    <TabsTrigger value="travel" className="flex items-center gap-2">
                      <RouteIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Travel</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-6 mt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 text-primary" />
                          Target Location
                        </label>
                        <LocationInput
                          value={location}
                          onChange={handleLocationChange}
                          placeholder="Search for any location worldwide..."
                          onLocationDetect={handleLocationDetection}
                          isDetecting={isLocationDetecting}
                          showCoordinates={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 6 months ahead
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground">
                          Select any date up to 6 months in advance
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <AlertIcon className="w-4 h-4 text-primary" />
                          Event Type
                        </label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outdoor-event" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Outdoor Event</div>
                                  <div className="text-xs text-muted-foreground">Festivals, concerts, parties</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="wedding" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Wedding Ceremony</div>
                                  <div className="text-xs text-muted-foreground">Outdoor wedding venues</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="sports" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Sports Event</div>
                                  <div className="text-xs text-muted-foreground">Marathons, tournaments</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="hiking" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Hiking & Trekking</div>
                                  <div className="text-xs text-muted-foreground">Trail hiking, mountain climbing</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="fishing" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Fishing & Boating</div>
                                  <div className="text-xs text-muted-foreground">Lake activities, water sports</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">⏰ Prediction Window</label>
                        <Select value={timeWindow} onValueChange={setTimeWindow}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-hour">Next 1 hour</SelectItem>
                            <SelectItem value="6-hours">Next 6 hours</SelectItem>
                            <SelectItem value="24-hours">Next 24 hours</SelectItem>
                            <SelectItem value="3-days">Next 3 days</SelectItem>
                            <SelectItem value="7-days">Next 7 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="nearby" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Center Location</label>
                        <div className="relative">
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter center location..."
                            className="pr-24"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleLocationDetection}
                            disabled={isLoading}
                            className="absolute right-1 top-1 bottom-1 text-xs"
                          >
                            <LocationIcon className="w-3 h-3 mr-1" />
                            Detect
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Scan Radius</label>
                        <Select defaultValue="50">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25 km</SelectItem>
                            <SelectItem value="50">50 km</SelectItem>
                            <SelectItem value="100">100 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Activity Type</label>
                        <Select value={activity} onValueChange={setActivity}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MOCK_DATA.activityProfiles).map(([key, profile]) => (
                              <SelectItem key={key} value={key}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Location</label>
                        <Input
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          placeholder="Starting point..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">End Location</label>
                        <Input
                          value={endLocation}
                          onChange={(e) => setEndLocation(e.target.value)}
                          placeholder="Destination..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Travel Date</label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={handlePrediction}
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-primary hover:opacity-90 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    `${activeMode === 'single' ? 'Predict Risk' : activeMode === 'nearby' ? 'Scan Area' : 'Analyze Route'}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Live Weather Intelligence - Mobile/Tablet */}
            <div className="lg:hidden">
              <LiveWeatherIntelligence location={location} coords={locationCoords} />
            </div>

            {/* Alternative Date Suggestions - Mobile/Tablet */}
            {prediction && prediction.type === 'single' && prediction.data.overall > 50 && (
              <div className="lg:hidden">
                <AlternativeDateSuggestions 
                  targetDate={date}
                  location={location}
                />
              </div>
            )}
            
            {/* Trip Tracker - Mobile/Tablet */}
            {prediction && activeMode === 'travel' && (
              <div className="lg:hidden">
                <TripTracker
                  tripName="Weather-Safe Journey"
                  startDate={date}
                  endDate={new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  location={`${startLocation} to ${endLocation}`}
                />
              </div>
            )}

            {/* Risk Result */}
            <AnimatePresence>
              {prediction && prediction.type === 'single' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>Risk Assessment</span>
                        <Badge variant="secondary">
                          {prediction.data.confidence}% Confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Overall Risk */}
                      <div className={`p-6 rounded-xl ${getRiskColor(prediction.data.overall)} text-white text-center`}>
                        <h3 className="text-lg font-bold mb-2">Overall Risk</h3>
                        <div className="text-4xl font-extrabold mb-1">
                          <CountUp end={prediction.data.overall} duration={1.5} />%
                        </div>
                        <p className="text-sm opacity-90 capitalize">
                          {getRiskLevel(prediction.data.overall)} Risk Level
                        </p>
                      </div>

                      {/* Activity Info */}
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-semibold text-sm text-muted-foreground">Optimized for</h4>
                        <p className="font-bold">{prediction.data.activity}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {prediction.data.activityDescription}
                        </p>
                      </div>

                      {/* Factor Breakdown */}
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(prediction.data.factors).map(([factor, value]) => (
                            <div key={factor} className="text-center p-3 bg-card rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 mb-2">
                        {factor === 'hot' && <SunIcon className="w-5 h-5 text-orange-500" />}
                        {factor === 'cold' && <SnowIcon className="w-5 h-5 text-blue-500" />}
                        {factor === 'windy' && <WindIcon className="w-5 h-5 text-cyan-500" />}
                        {factor === 'wet' && <CloudRainIcon className="w-5 h-5 text-blue-600" />}
                      </div>
                              <div className="text-xs font-medium capitalize mb-1">{factor}</div>
                              <div className="text-lg font-bold">
                                <CountUp end={value as number} duration={1} />%
                              </div>
                            </div>
                          ))}
                      </div>

                       {/* Event Success Probability */}
                       <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
                         <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                           <TrendingUpIcon className="w-4 h-4 text-primary" />
                           Event Success Probability
                           <Badge variant="outline" className="text-xs">
                             ML Model v2.1
                           </Badge>
                         </h4>
                         <div className="text-2xl font-bold text-primary mb-2">
                           {prediction.data.eventSuccess}
                         </div>
                         <p className="text-xs text-muted-foreground">
                           Based on {prediction.data.processedDataPoints?.toLocaleString()} historical data points
                         </p>
                       </div>

                       {/* Adverse Weather Breakdown */}
                       {prediction.data.adverseWeatherProbability && (
                         <div className="p-4 bg-muted/10 rounded-lg">
                           <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                             <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                             Adverse Weather Probabilities
                           </h4>
                           <div className="grid grid-cols-2 gap-3">
                             <div className="text-center">
                               <div className="text-lg font-bold text-blue-500">
                                 {Math.round(prediction.data.adverseWeatherProbability.rain)}%
                               </div>
                               <div className="text-xs text-muted-foreground">Rain Risk</div>
                             </div>
                             <div className="text-center">
                               <div className="text-lg font-bold text-cyan-500">
                                 {Math.round(prediction.data.adverseWeatherProbability.strongWind)}%
                               </div>
                               <div className="text-xs text-muted-foreground">Strong Winds</div>
                             </div>
                             <div className="text-center">
                               <div className="text-lg font-bold text-orange-500">
                                 {Math.round(prediction.data.adverseWeatherProbability.extremeTemp)}%
                               </div>
                               <div className="text-xs text-muted-foreground">Extreme Temps</div>
                             </div>
                             <div className="text-center">
                               <div className="text-lg font-bold text-red-500">
                                 {Math.round(prediction.data.adverseWeatherProbability.overallDiscomfort)}%
                               </div>
                               <div className="text-xs text-muted-foreground">Discomfort</div>
                             </div>
                           </div>
                         </div>
                       )}

                        {/* Recommendations */}
                        <div className="p-4 bg-muted/10 rounded-lg">
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                            </svg>
                            Smart Recommendations
                          </h4>
                         <div className="space-y-2">
                           {prediction.data.recommendations?.map((rec: string, index: number) => (
                             <div key={index} className="flex items-start gap-2 text-sm">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                               <span className="text-muted-foreground">{rec}</span>
                             </div>
                           ))}
                         </div>
                       </div>

                       {/* Climate Trend */}
                       {prediction.data.trend && (
                          <div className="p-4 bg-muted/10 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <TrendingUpIcon className="w-4 h-4 text-primary" />
                              Climate Trend Analysis
                              <Badge variant="outline" className="text-xs">
                                {Math.round(prediction.data.trend.significance * 100)}% confidence
                              </Badge>
                            </h4>
                           <p className="text-sm text-muted-foreground">
                             {prediction.data.trend.change}
                           </p>
                         </div>
                       )}

                      {/* AI Insight */}
                      <div className="p-4 border border-border/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm mb-2">AI-Generated Insight</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {prediction.data.insight}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Weather Map - Center Column */}
          <div className="lg:col-span-5">
            <Card className="glass h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[800px] relative overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LocationIcon className="w-4 h-4 text-primary" />
                  </div>
                  Real-Time Weather Map
                  {prediction && (
                    <Badge variant="secondary" className="ml-auto">
                      {prediction.locations.length} {prediction.locations.length === 1 ? 'Location' : 'Locations'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <InteractiveMap
                  mode={activeMode}
                  locations={prediction?.locations || []}
                  travelRoute={prediction?.travelRoute}
                  center={
                    activeMode === 'travel' 
                      ? startCoords 
                      : locationCoords
                  }
                  zoom={activeMode === 'single' ? 6 : activeMode === 'nearby' ? 8 : 4}
                  isLoading={isLoading}
                  onLocationSelect={(coords) => {
                    console.log('Selected location:', coords);
                    setLocationCoords(coords);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Weather Intelligence & Trip Tracker - Right Column (Desktop only) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <LiveWeatherIntelligence location={location} coords={locationCoords} />
            
            {prediction && prediction.type === 'single' && prediction.data.overall > 50 && (
              <AlternativeDateSuggestions 
                targetDate={date}
                location={location}
              />
            )}
            
            {prediction && activeMode === 'travel' && (
              <TripTracker
                tripName="Weather-Safe Journey"
                startDate={date}
                endDate={new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                location={`${startLocation} to ${endLocation}`}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PredictPage;