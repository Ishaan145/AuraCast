import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LocationIcon, AlertIcon, CalendarIcon, RouteIcon } from './Icons';
import { useToast } from '@/hooks/use-toast';

interface TripAlert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: Date;
  suggestion?: string;
}

interface TripTrackerProps {
  tripName: string;
  startDate: string;
  endDate: string;
  location: string;
  onAlertAction?: (alertId: string, action: string) => void;
}

export const TripTracker: React.FC<TripTrackerProps> = ({
  tripName,
  startDate,
  endDate,
  location,
  onAlertAction
}) => {
  const [isActive, setIsActive] = useState(false);
  const [alerts, setAlerts] = useState<TripAlert[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Simulate real-time weather monitoring
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate random weather alerts
      if (Math.random() > 0.7) {
        const newAlert: TripAlert = {
          id: Date.now().toString(),
          severity: Math.random() > 0.5 ? 'medium' : 'low',
          title: 'Weather Update',
          message: getRandomWeatherAlert(),
          timestamp: new Date(),
          suggestion: getRandomSuggestion()
        };

        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        
        toast({
          title: newAlert.title,
          description: newAlert.message,
          variant: newAlert.severity === 'high' ? 'destructive' : 'default'
        });
      }

      // Update progress based on time
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const totalDuration = end - start;
      const elapsed = now - start;
      const newProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setProgress(newProgress);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isActive, startDate, endDate]);

  const getRandomWeatherAlert = () => {
    const alerts = [
      'Light rain expected in 2 hours',
      'Temperature dropping by 5°C',
      'Wind speed increasing to 25 km/h',
      'Humidity rising to 75%',
      'Clear skies for next 4 hours',
      'UV index increasing - wear sunscreen'
    ];
    return alerts[Math.floor(Math.random() * alerts.length)];
  };

  const getRandomSuggestion = () => {
    const suggestions = [
      'Consider carrying an umbrella',
      'Wear layered clothing',
      'Plan indoor activities for afternoon',
      'Best time for outdoor activities: morning',
      'Stay hydrated and avoid direct sun'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted';
    }
  };

  const startTracking = () => {
    setIsActive(true);
    toast({
      title: "Trip tracking started",
      description: `Monitoring weather for ${location}`,
    });
  };

  const stopTracking = () => {
    setIsActive(false);
    setAlerts([]);
    toast({
      title: "Trip tracking stopped",
      description: "Weather monitoring paused",
    });
  };

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <RouteIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{tripName || 'Trip Tracker'}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <LocationIcon className="w-3 h-3" />
                {location}
              </p>
            </div>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? '🔴 Live' : '⚪ Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Trip Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {new Date(startDate).toLocaleDateString()}
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
            <span className="text-muted-foreground">
              {new Date(endDate).toLocaleDateString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Control Button */}
        <Button
          onClick={isActive ? stopTracking : startTracking}
          variant={isActive ? 'outline' : 'default'}
          className="w-full"
        >
          {isActive ? 'Stop Tracking' : 'Start Real-Time Tracking'}
        </Button>

        {/* Alerts */}
        {isActive && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertIcon className="w-4 h-4 text-primary" />
              Recent Alerts
            </h4>
            
            <AnimatePresence mode="popLayout">
              {alerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-sm text-muted-foreground"
                >
                  Monitoring weather... No alerts yet
                </motion.div>
              ) : (
                alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-semibold text-sm">{alert.title}</h5>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs mb-2">{alert.message}</p>
                    {alert.suggestion && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {alert.suggestion}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Status */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            {isActive 
              ? '🛡️ Your trip is being monitored for weather changes'
              : '⏸️ Start tracking to receive real-time weather alerts'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
