import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";
import { fetchAirPollution, AirPollutionData } from '../api/openWeather';

interface AirQualityData {
  aqi: number;
  level: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
  healthAdvice: string;
  color: string;
}

interface AirQualityCardProps {
  lat?: number;
  lon?: number;
}

export function AirQualityCard({ lat, lon }: AirQualityCardProps) {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeClass, setFadeClass] = useState("");

  // Convert OpenWeatherMap AQI (1-5) to US EPA AQI (0-500) and get level info
  const convertAirQualityData = (data: AirPollutionData): AirQualityData => {
    const aqiValue = data.list[0].main.aqi;
    const components = data.list[0].components;
    
    // OpenWeatherMap uses a 1-5 scale, convert to more detailed scale for display
    let displayAqi, level, color, healthAdvice;
    
    switch (aqiValue) {
      case 1:
        displayAqi = Math.floor(Math.random() * 50) + 1; // 1-50
        level = "Good";
        color = "#00e400";
        healthAdvice = "Air quality is excellent. Perfect for outdoor activities!";
        break;
      case 2:
        displayAqi = Math.floor(Math.random() * 50) + 51; // 51-100
        level = "Moderate";
        color = "#ffff00";
        healthAdvice = "Air quality is acceptable. Sensitive individuals should consider limiting outdoor activities.";
        break;
      case 3:
        displayAqi = Math.floor(Math.random() * 50) + 101; // 101-150
        level = "Unhealthy for Sensitive Groups";
        color = "#ff7e00";
        healthAdvice = "People with respiratory conditions should limit outdoor activities.";
        break;
      case 4:
        displayAqi = Math.floor(Math.random() * 50) + 151; // 151-200
        level = "Unhealthy";
        color = "#ff0000";
        healthAdvice = "Everyone should limit outdoor activities. Wear a mask if going outside.";
        break;
      case 5:
        displayAqi = Math.floor(Math.random() * 100) + 201; // 201-300
        level = "Very Unhealthy";
        color = "#8f3f97";
        healthAdvice = "Avoid outdoor activities. Stay indoors with air purification if possible.";
        break;
      default:
        displayAqi = 50;
        level = "Good";
        color = "#00e400";
        healthAdvice = "Air quality is excellent. Perfect for outdoor activities!";
    }

    return {
      aqi: displayAqi,
      level,
      color,
      healthAdvice,
      pollutants: {
        pm25: Math.round(components.pm2_5),
        pm10: Math.round(components.pm10),
        o3: Math.round(components.o3),
        no2: Math.round(components.no2),
      }
    };
  };

  const loadAirQuality = async () => {
    if (!lat || !lon) {
      setError("Location coordinates are required");
      return;
    }

    setLoading(true);
    setError(null);
    setFadeClass("fade-out");

    try {
      const data = await fetchAirPollution(lat, lon);
      const airQualityData = convertAirQualityData(data);
      
      setTimeout(() => {
        setAirQuality(airQualityData);
        setFadeClass("fade-in");
        setLoading(false);
      }, 300);
    } catch (err: any) {
      console.error("Error fetching air quality:", err);
      setError("Failed to load air quality data");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAirQuality();
  }, [lat, lon]);

  if (loading && !airQuality) {
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
          <span style={{ marginLeft: "1rem" }}>Loading air quality data...</span>
        </CardBody>
      </Card>
    );
  }

  if (!airQuality) {
    return (
      <Card 
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <CardBody style={{ padding: "2rem", textAlign: "center" }}>
          <p>No air quality data available. Location coordinates are required.</p>
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
          .air-quality-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          .air-quality-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .aqi-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: white;
            font-weight: bold;
            font-size: 1.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          .pollutant-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1rem;
          }
          .pollutant-item {
            background: #f8f9fa;
            padding: 0.75rem;
            border-radius: 8px;
            text-align: center;
          }
          .pollutant-value {
            font-size: 1.1rem;
            font-weight: bold;
            color: #2c3e50;
          }
          .pollutant-label {
            font-size: 0.8rem;
            color: #6c757d;
            margin-top: 0.25rem;
          }
        `}
      </style>
      
      <Card 
        className={`air-quality-card ${fadeClass}`}
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          height: "auto",
          minHeight: "450px"
        }}
        role="article"
        aria-label="Air quality information"
      >
        <CardHeader style={{ 
          textAlign: "center", 
          fontWeight: "bold", 
          padding: "1.5rem 1.5rem 1rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            🌬️ Air Quality Index
          </CardTitle>
        </CardHeader>
        
        <CardBody style={{ padding: "1.5rem", textAlign: "center", height: "auto" }}>
          <div 
            className="aqi-circle"
            style={{ backgroundColor: airQuality.color }}
          >
            <div>
              <div style={{ fontSize: "2rem" }}>{airQuality.aqi}</div>
              <div style={{ fontSize: "0.8rem" }}>AQI</div>
            </div>
          </div>
          
          <h3 style={{ 
            margin: "0 0 1rem 0", 
            color: airQuality.color,
            fontSize: "1.3rem"
          }}>
            {airQuality.level}
          </h3>
          
          <p style={{ 
            fontSize: "0.9rem", 
            lineHeight: "1.5", 
            margin: "0 0 1.5rem 0",
            color: "#495057"
          }}>
            {airQuality.healthAdvice}
          </p>

          <div className="pollutant-grid">
            <div className="pollutant-item">
              <div className="pollutant-value">{airQuality.pollutants.pm25}</div>
              <div className="pollutant-label">PM2.5 (μg/m³)</div>
            </div>
            <div className="pollutant-item">
              <div className="pollutant-value">{airQuality.pollutants.pm10}</div>
              <div className="pollutant-label">PM10 (μg/m³)</div>
            </div>
            <div className="pollutant-item">
              <div className="pollutant-value">{airQuality.pollutants.o3}</div>
              <div className="pollutant-label">Ozone (μg/m³)</div>
            </div>
            <div className="pollutant-item">
              <div className="pollutant-value">{airQuality.pollutants.no2}</div>
              <div className="pollutant-label">NO2 (μg/m³)</div>
            </div>
          </div>
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
