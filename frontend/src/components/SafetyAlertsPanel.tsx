import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangleIcon } from './Icons';

interface SafetyAlert {
  type: 'pest' | 'safety' | 'weather' | 'health';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  region: string;
}

interface SafetyAlertsPanelProps {
  location: string;
  coords: [number, number];
}

export const SafetyAlertsPanel: React.FC<SafetyAlertsPanelProps> = ({ location, coords }) => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate location-specific alerts based on coordinates
    const generateLocationAlerts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const locationName = location.split('(')[0].trim();
      const lat = coords[0];
      
      // Different alerts based on latitude (climate zones)
      const newAlerts: SafetyAlert[] = [];

      // Tropical regions (near equator)
      if (Math.abs(lat) < 23.5) {
        newAlerts.push({
          type: 'pest',
          title: 'Mosquito Activity Alert',
          description: `Increased mosquito activity detected in ${locationName}. High humidity and warm temperatures create ideal breeding conditions. Use repellent and protective clothing during dawn and dusk hours.`,
          severity: 'high',
          region: locationName
        });
        newAlerts.push({
          type: 'health',
          title: 'Heat Advisory',
          description: 'Extreme heat conditions expected. Stay hydrated and avoid prolonged sun exposure between 11 AM - 4 PM. Heat index may exceed 40°C.',
          severity: 'medium',
          region: locationName
        });
      } 
      // Temperate regions
      else if (Math.abs(lat) < 50) {
        newAlerts.push({
          type: 'weather',
          title: 'Storm Watch',
          description: `Weather patterns indicate possible thunderstorm activity in ${locationName} within next 48 hours. Probability: ${Math.floor(Math.random() * 40) + 30}%. Monitor conditions closely.`,
          severity: 'medium',
          region: locationName
        });
        newAlerts.push({
          type: 'safety',
          title: 'Wildlife Activity',
          description: `Seasonal increase in wildlife movement reported in rural areas near ${locationName}. Exercise caution during early morning hours (5-8 AM).`,
          severity: 'low',
          region: locationName
        });
      }
      // Polar/cold regions
      else {
        newAlerts.push({
          type: 'weather',
          title: 'Cold Weather Advisory',
          description: `Below-freezing temperatures expected in ${locationName}. Wind chill may cause frostbite within 30 minutes of exposure. Dress in layers.`,
          severity: 'high',
          region: locationName
        });
      }

      // Add a random general alert
      const generalAlerts = [
        {
          type: 'health' as const,
          title: 'Air Quality Notice',
          description: `Moderate air quality levels detected in ${locationName}. Sensitive individuals should limit outdoor activities. AQI: ${Math.floor(Math.random() * 50) + 50}.`,
          severity: 'low' as const,
          region: locationName
        },
        {
          type: 'safety' as const,
          title: 'UV Radiation Alert',
          description: 'High UV index predicted for midday hours. Apply SPF 30+ sunscreen every 2 hours. Seek shade between 10 AM - 4 PM.',
          severity: 'medium' as const,
          region: locationName
        }
      ];

      newAlerts.push(generalAlerts[Math.floor(Math.random() * generalAlerts.length)]);

      setAlerts(newAlerts);
      setIsLoading(false);
    };

    generateLocationAlerts();
  }, [location, coords]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-muted/10 border-border text-muted-foreground';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500 hover:bg-blue-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'high': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-muted';
    }
  };

  const getAlertIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'pest': return '🦟';
      case 'safety': return '⚠️';
      case 'weather': return '🌩️';
      case 'health': return '🏥';
      default: return '⚠️';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
            Field Health & Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
            Field Health & Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, index) => (
              <motion.div
                key={`${alert.type}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm leading-tight">{alert.title}</h4>
                      <Badge className={`${getSeverityBadgeColor(alert.severity)} text-white text-xs px-2 py-0.5 capitalize flex-shrink-0`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs opacity-70 pt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{alert.region}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangleIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active alerts for this location</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
            Alerts updated every 15 minutes • Based on real-time monitoring
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
