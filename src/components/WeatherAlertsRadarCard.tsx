import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: Date;
  endTime: Date;
  area: string;
}

interface RadarData {
  precipitationIntensity: 'none' | 'light' | 'moderate' | 'heavy';
  precipitationType: 'rain' | 'snow' | 'sleet' | 'none';
  coverage: number; // percentage of area affected
  movement: string;
  estimatedArrival?: string;
}

interface WeatherAlertsRadarProps {
  lat?: number;
  lon?: number;
}

export function WeatherAlertsRadarCard({ lat, lon }: WeatherAlertsRadarProps) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeClass, setFadeClass] = useState("");

  // Mock data for demonstration - replace with real weather service API
  const getMockAlertsAndRadar = (): { alerts: WeatherAlert[], radar: RadarData } => {
    const alertTypes = [
      {
        title: "Thunderstorm Watch",
        description: "Conditions favorable for severe thunderstorms. Monitor weather conditions and be prepared to take shelter.",
        severity: 'moderate' as const,
        area: "Metro Area"
      },
      {
        title: "Heavy Rain Advisory",
        description: "Heavy rainfall expected with localized flooding possible in low-lying areas.",
        severity: 'minor' as const,
        area: "Eastern Counties"
      },
      {
        title: "High Wind Warning",
        description: "Damaging winds 70-80 mph possible. Secure loose objects and avoid travel if possible.",
        severity: 'severe' as const,
        area: "Coastal Regions"
      },
      {
        title: "Heat Advisory",
        description: "Dangerously hot conditions with heat index values up to 105°F. Stay hydrated and avoid prolonged sun exposure.",
        severity: 'moderate' as const,
        area: "Inland Areas"
      }
    ];

    const numAlerts = Math.floor(Math.random() * 3); // 0-2 alerts
    const selectedAlerts: WeatherAlert[] = [];
    
    for (let i = 0; i < numAlerts; i++) {
      const alertTemplate = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const now = new Date();
      const startTime = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000); // Started 0-2 hours ago
      const endTime = new Date(now.getTime() + (4 + Math.random() * 8) * 60 * 60 * 1000); // Ends in 4-12 hours
      
      selectedAlerts.push({
        id: `alert-${i}`,
        ...alertTemplate,
        startTime,
        endTime
      });
    }

    const precipTypes = ['rain', 'snow', 'sleet', 'none'] as const;
    const intensities = ['none', 'light', 'moderate', 'heavy'] as const;
    const movements = [
      'Moving northeast at 15 mph',
      'Moving southeast at 20 mph',
      'Stationary over the area',
      'Moving west at 10 mph',
      'Approaching from the southwest'
    ];

    const precipType = precipTypes[Math.floor(Math.random() * precipTypes.length)];
    const intensity = precipType === 'none' ? 'none' : intensities[Math.floor(Math.random() * (intensities.length - 1)) + 1];
    
    const radar: RadarData = {
      precipitationType: precipType,
      precipitationIntensity: intensity,
      coverage: precipType === 'none' ? 0 : Math.floor(Math.random() * 80) + 10, // 10-90% if precipitation
      movement: movements[Math.floor(Math.random() * movements.length)],
      estimatedArrival: intensity !== 'none' && Math.random() > 0.5 
        ? `${Math.floor(Math.random() * 120) + 15} minutes` 
        : undefined
    };

    return { alerts: selectedAlerts, radar };
  };

  const loadAlertsAndRadar = async () => {
    setLoading(true);
    setError(null);
    setFadeClass("fade-out");

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { alerts: newAlerts, radar } = getMockAlertsAndRadar();
      
      setTimeout(() => {
        setAlerts(newAlerts);
        setRadarData(radar);
        setFadeClass("fade-in");
        setLoading(false);
      }, 300);
    } catch (err: any) {
      console.error("Error fetching weather alerts and radar:", err);
      setError("Failed to load weather alerts and radar data");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsAndRadar();
  }, [lat, lon]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return '#FFA726';
      case 'moderate': return '#FF7043';
      case 'severe': return '#F44336';
      case 'extreme': return '#9C27B0';
      default: return '#2196F3';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'minor': return '⚠️';
      case 'moderate': return '🟠';
      case 'severe': return '🔴';
      case 'extreme': return '🟣';
      default: return 'ℹ️';
    }
  };

  const getPrecipitationIcon = (type: string, intensity: string) => {
    if (intensity === 'none') return '☀️';
    switch (type) {
      case 'rain': return intensity === 'heavy' ? '🌧️' : '🌦️';
      case 'snow': return '🌨️';
      case 'sleet': return '🌨️';
      default: return '☁️';
    }
  };

  if (loading && alerts.length === 0 && !radarData) {
    return (
      <Card 
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          minHeight: "300px",
          height: "auto"
        }}
      >
        <CardBody style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "2rem" 
        }}>
          <Loader type="infinite-spinner" />
          <span style={{ marginLeft: "1rem" }}>Loading weather alerts and radar...</span>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <style>
        {`
          .fade-in {
            opacity: 1;
            transition: opacity 0.3s ease-in;
          }
          .fade-out {
            opacity: 0.3;
            transition: opacity 0.3s ease-out;
          }
          .alerts-radar-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          .alerts-radar-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .alert-item {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 0.75rem;
            border-left: 4px solid;
          }
          .alert-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .alert-title {
            font-weight: bold;
            font-size: 0.9rem;
            color: #2c3e50;
          }
          .alert-area {
            font-size: 0.75rem;
            color: #6c757d;
            background: #e9ecef;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            margin-left: auto;
          }
          .alert-description {
            font-size: 0.8rem;
            color: #495057;
            line-height: 1.4;
            margin-bottom: 0.5rem;
          }
          .alert-time {
            font-size: 0.75rem;
            color: #6c757d;
            font-style: italic;
          }
          .radar-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
          }
          .radar-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            font-weight: bold;
            color: #2c3e50;
          }
          .radar-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            font-size: 0.85rem;
          }
          .radar-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .radar-label {
            color: #6c757d;
            font-size: 0.75rem;
          }
          .radar-value {
            color: #2c3e50;
            font-weight: 500;
          }
          .no-alerts {
            text-align: center;
            padding: 1.5rem;
            color: #28a745;
            background: #d4edda;
            border-radius: 12px;
            margin-bottom: 1rem;
          }
        `}
      </style>
      
      <Card 
        className={`alerts-radar-card ${fadeClass}`}
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          height: "auto",
          minHeight: "400px"
        }}
        role="article"
        aria-label="Weather alerts and radar information"
      >
        <CardHeader style={{ 
          textAlign: "center", 
          fontWeight: "bold", 
          padding: "1.5rem 1.5rem 1rem",
          background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px"
        }}>
          <CardTitle style={{ 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "0.5rem" 
          }}>
            🚨 Weather Alerts & Radar
          </CardTitle>
        </CardHeader>
        
        <CardBody style={{ padding: "1.5rem", height: "auto" }}>
          {/* Weather Alerts Section */}
          <div>
            <h4 style={{ margin: "0 0 1rem 0", color: "#2c3e50", fontSize: "1.1rem" }}>
              Active Alerts
            </h4>
            
            {alerts.length === 0 ? (
              <div className="no-alerts">
                ✅ No active weather alerts for your area
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="alert-item"
                  style={{ borderLeftColor: getSeverityColor(alert.severity) }}
                >
                  <div className="alert-header">
                    <span>{getSeverityIcon(alert.severity)}</span>
                    <span className="alert-title">{alert.title}</span>
                    <span className="alert-area">{alert.area}</span>
                  </div>
                  <div className="alert-description">{alert.description}</div>
                  <div className="alert-time">
                    Until {alert.endTime.toLocaleString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Radar Section */}
          {radarData && (
            <div className="radar-section">
              <div className="radar-header">
                📡 Weather Radar
              </div>
              <div className="radar-info">
                <div className="radar-item">
                  <span className="radar-label">Precipitation</span>
                  <span className="radar-value">
                    {getPrecipitationIcon(radarData.precipitationType, radarData.precipitationIntensity)}
                    {' '}{radarData.precipitationIntensity === 'none' 
                      ? 'Clear' 
                      : `${radarData.precipitationIntensity} ${radarData.precipitationType}`}
                  </span>
                </div>
                <div className="radar-item">
                  <span className="radar-label">Coverage</span>
                  <span className="radar-value">{radarData.coverage}% of area</span>
                </div>
                <div className="radar-item">
                  <span className="radar-label">Movement</span>
                  <span className="radar-value">{radarData.movement}</span>
                </div>
                {radarData.estimatedArrival && (
                  <div className="radar-item">
                    <span className="radar-label">ETA</span>
                    <span className="radar-value">~{radarData.estimatedArrival}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {error && (
        <Notification 
          type={{ style: "warning", icon: true }}
          closable
          onClose={() => setError(null)}
        >
          {error}
        </Notification>
      )}
    </>
  );
}
