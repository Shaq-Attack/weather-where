import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";
import { getCurrentUVIndex, fetchUVIndex, fetchWeather } from '../api/openWeather';

interface UVData {
  uvIndex: number;
  riskLevel: string;
  color: string;
  sunrise: string;
  sunset: string;
  peakUVTime: string;
  recommendation: string;
  spfRecommendation: string;
}

interface UVIndexCardProps {
  lat?: number;
  lon?: number;
}

export function UVIndexCard({ lat, lon }: UVIndexCardProps) {
  const [uvData, setUvData] = useState<UVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeClass, setFadeClass] = useState("");
  const cancelTokenRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const loadUVData = async () => {
    // Cancel any previous request
    cancelTokenRef.current.cancelled = true;
    
    // Create new cancel token for this request
    const currentToken = { cancelled: false };
    cancelTokenRef.current = currentToken;

    if (!lat || !lon) {
      return;
    }

    setLoading(true);
    setError(null);
    setFadeClass("fade-out");

    try {
      const [uvData, weatherData] = await Promise.all([
        fetchUVIndex(lat, lon),
        fetchWeather(lat, lon)
      ]);
      const uvIndex = getCurrentUVIndex(uvData);
      
      // Check if this request was cancelled before setting state
      if (currentToken.cancelled) {
        return;
      }
      
      let riskLevel, color, recommendation, spfRecommendation;
      
      // Handle zero UV Index gracefully
      if (uvIndex === 0) {
        riskLevel = "No Risk";
        color = "#6c757d";
        recommendation = "No UV exposure risk at this time (nighttime hours or overcast conditions).";
        spfRecommendation = "No protection needed";
      } else if (uvIndex <= 2) {
        riskLevel = "Low";
        color = "#289500";
        recommendation = "No protection needed. You can safely enjoy the outdoors!";
        spfRecommendation = "SPF 15+";
      } else if (uvIndex <= 5) {
        riskLevel = "Moderate";
        color = "#f7e400";
        recommendation = "Some protection required. Seek shade during midday hours.";
        spfRecommendation = "SPF 30+";
      } else if (uvIndex <= 7) {
        riskLevel = "High";
        color = "#f85900";
        recommendation = "Protection required. Seek shade and wear protective clothing.";
        spfRecommendation = "SPF 30+";
      } else if (uvIndex <= 10) {
        riskLevel = "Very High";
        color = "#d8001d";
        recommendation = "Extra protection required. Avoid being outside during midday hours.";
        spfRecommendation = "SPF 50+";
      } else {
        riskLevel = "Extreme";
        color = "#6b49c8";
        recommendation = "Avoid outside exposure. Take all precautions.";
        spfRecommendation = "SPF 50+";
      }

      // Get real sunrise/sunset from weather API
      const sunriseTime = new Date(weatherData.sys.sunrise * 1000);
      const sunsetTime = new Date(weatherData.sys.sunset * 1000);

      const data: UVData = {
        uvIndex,
        riskLevel,
        color,
        sunrise: sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        peakUVTime: "12:00 PM - 2:00 PM",
        recommendation,
        spfRecommendation
      };
      
      // Final check before setting state
      if (!currentToken.cancelled) {
        setTimeout(() => {
          if (!currentToken.cancelled) {
            setUvData(data);
            setFadeClass("fade-in");
            setLoading(false);
          }
        }, 300);
      }
    } catch (err: any) {
      // Only update state if request wasn't cancelled
      if (!currentToken.cancelled) {
        console.error("Error fetching UV data:", err);
        setError("Failed to load UV index data");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUVData();
  }, [lat, lon]);

  if (loading && !uvData) {
    return (
      <Card 
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          minHeight: "250px"
        }}
      >
        <CardBody style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "2rem" 
        }}>
          <Loader type="infinite-spinner" />
          <span style={{ marginLeft: "1rem" }}>Loading UV index data...</span>
        </CardBody>
      </Card>
    );
  }

  if (!uvData) {
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
          <p>No UV index data available</p>
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
          .uv-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          .uv-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .uv-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: white;
            font-weight: bold;
            font-size: 1.3rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          .sun-times {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
          }
          .sun-time-item {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 12px;
            text-align: center;
          }
          .sun-time-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .sun-time-label {
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 0.25rem;
          }
          .sun-time-value {
            font-size: 1rem;
            font-weight: bold;
            color: #2c3e50;
          }
          .protection-tip {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
            border-left: 4px solid #667eea;
          }
          .protection-tip-title {
            font-size: 0.9rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 0.5rem;
          }
          .protection-tip-content {
            font-size: 0.85rem;
            color: #495057;
            line-height: 1.4;
          }
        `}
      </style>
      
      <Card 
        className={`uv-card ${fadeClass}`}
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "600px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
        role="article"
        aria-label="UV index and sun safety information"
      >
        <CardHeader style={{ 
          textAlign: "center", 
          fontWeight: "bold", 
          padding: "1.5rem 1.5rem 1rem",
          background: "linear-gradient(135deg, #ffa726 0%, #ff7043 100%)",
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
            ☀️ UV Index & Sun Safety
          </CardTitle>
        </CardHeader>
        
        <CardBody style={{ padding: "1.5rem", textAlign: "center" }}>
          <div 
            className="uv-circle"
            style={{ backgroundColor: uvData.color }}
          >
            <div>
              <div style={{ fontSize: "1.8rem" }}>{uvData.uvIndex}</div>
              <div style={{ fontSize: "0.7rem" }}>UV INDEX</div>
            </div>
          </div>
          
          <h3 style={{ 
            margin: "0 0 1rem 0", 
            color: uvData.color,
            fontSize: "1.2rem"
          }}>
            {uvData.riskLevel} Risk
          </h3>

          <div className="sun-times">
            <div className="sun-time-item">
              <div className="sun-time-icon">🌅</div>
              <div className="sun-time-label">Sunrise</div>
              <div className="sun-time-value">{uvData.sunrise}</div>
            </div>
            <div className="sun-time-item">
              <div className="sun-time-icon">🌇</div>
              <div className="sun-time-label">Sunset</div>
              <div className="sun-time-value">{uvData.sunset}</div>
            </div>
          </div>

          <div style={{ 
            margin: "1rem 0",
            padding: "0.75rem",
            background: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffeaa7"
          }}>
            <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#856404" }}>
              ⚠️ Peak UV: {uvData.peakUVTime}
            </div>
          </div>

          <div className="protection-tip">
            <div className="protection-tip-title">🧴 Recommended Protection</div>
            <div className="protection-tip-content">
              <strong>{uvData.spfRecommendation} sunscreen</strong><br />
              {uvData.recommendation}
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
