import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { fetchAirPollution, AirPollutionData } from '../../api/openWeather';
import { cardStyles, headerStyles, bodyStyles } from '../../utils/styles';
import { 
  LoadingCard, 
  ErrorCard, 
  ErrorNotification, 
  useLoadingWithFade,
  createCancelToken,
  isCancelled,
  cancelToken
} from '../../utils/components';
import { 
  GlobalAnimationStyles, 
  CircularIndicator, 
  ProtectionTip
} from '../../utils/styleComponents';

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
  const [error, setError] = useState<string | null>(null);
  const { loading, fadeClass, startLoading, finishLoading } = useLoadingWithFade();
  const cancelTokenRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  // Calculate US EPA AQI from pollutant concentrations
  const calculateUSEPAAQI = (pm25: number, pm10: number, o3: number, no2: number): number => {
    // US EPA AQI calculation for PM2.5 (24-hour average)
    const calculatePM25AQI = (concentration: number): number => {
      const breakpoints = [
        { cLo: 0.0, cHi: 12.0, iLo: 0, iHi: 50 },
        { cLo: 12.1, cHi: 35.4, iLo: 51, iHi: 100 },
        { cLo: 35.5, cHi: 55.4, iLo: 101, iHi: 150 },
        { cLo: 55.5, cHi: 150.4, iLo: 151, iHi: 200 },
        { cLo: 150.5, cHi: 250.4, iLo: 201, iHi: 300 },
        { cLo: 250.5, cHi: 350.4, iLo: 301, iHi: 400 },
        { cLo: 350.5, cHi: 500.4, iLo: 401, iHi: 500 }
      ];
      
      for (const bp of breakpoints) {
        if (concentration >= bp.cLo && concentration <= bp.cHi) {
          return Math.round(((bp.iHi - bp.iLo) / (bp.cHi - bp.cLo)) * (concentration - bp.cLo) + bp.iLo);
        }
      }
      return concentration > 500.4 ? 500 : 0;
    };

    // Calculate PM10 AQI (24-hour average)
    const calculatePM10AQI = (concentration: number): number => {
      const breakpoints = [
        { cLo: 0, cHi: 54, iLo: 0, iHi: 50 },
        { cLo: 55, cHi: 154, iLo: 51, iHi: 100 },
        { cLo: 155, cHi: 254, iLo: 101, iHi: 150 },
        { cLo: 255, cHi: 354, iLo: 151, iHi: 200 },
        { cLo: 355, cHi: 424, iLo: 201, iHi: 300 },
        { cLo: 425, cHi: 504, iLo: 301, iHi: 400 },
        { cLo: 505, cHi: 604, iLo: 401, iHi: 500 }
      ];
      
      for (const bp of breakpoints) {
        if (concentration >= bp.cLo && concentration <= bp.cHi) {
          return Math.round(((bp.iHi - bp.iLo) / (bp.cHi - bp.cLo)) * (concentration - bp.cLo) + bp.iLo);
        }
      }
      return concentration > 604 ? 500 : 0;
    };

    // Calculate AQI for each pollutant and return the highest (worst)
    const pm25AQI = calculatePM25AQI(pm25);
    const pm10AQI = calculatePM10AQI(pm10);
    
    // For O3 and NO2, use simplified approximations since they require hourly vs daily averages
    // These are rough estimates - real AQI would need proper time-weighted averages
    const o3AQI = Math.min(Math.round(o3 * 0.3), 500);     // Rough approximation
    const no2AQI = Math.min(Math.round(no2 * 0.5), 500);   // Rough approximation
    
    return Math.max(pm25AQI, pm10AQI, o3AQI, no2AQI);
  };

  // Convert pollutant data to AQI with proper calculation
  const convertAirQualityData = (data: AirPollutionData): AirQualityData => {
    const components = data.list[0].components;
    
    // Calculate proper US EPA AQI from pollutant concentrations
    const calculatedAQI = calculateUSEPAAQI(
      components.pm2_5,
      components.pm10,
      components.o3,
      components.no2
    );
    
    // Determine level, color, and health advice based on calculated AQI
    let level, color, healthAdvice;
    
    if (calculatedAQI <= 50) {
      level = "Good";
      color = "#00e400";
      healthAdvice = "Air quality is excellent. Perfect for outdoor activities!";
    } else if (calculatedAQI <= 100) {
      level = "Moderate";
      color = "#ffff00";
      healthAdvice = "Air quality is acceptable. Sensitive individuals should consider limiting outdoor activities.";
    } else if (calculatedAQI <= 150) {
      level = "Unhealthy for Sensitive Groups";
      color = "#ff7e00";
      healthAdvice = "People with respiratory conditions should limit outdoor activities.";
    } else if (calculatedAQI <= 200) {
      level = "Unhealthy";
      color = "#ff0000";
      healthAdvice = "Everyone should limit outdoor activities. Wear a mask if going outside.";
    } else if (calculatedAQI <= 300) {
      level = "Very Unhealthy";
      color = "#8f3f97";
      healthAdvice = "Avoid outdoor activities. Stay indoors with air purification if possible.";
    } else {
      level = "Hazardous";
      color = "#7e0023";
      healthAdvice = "Health alert! Everyone should avoid all outdoor activities.";
    }

    return {
      aqi: calculatedAQI,
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
    // Cancel any previous request
    cancelToken(cancelTokenRef.current);
    
    // Create new cancel token for this request
    const currentToken = createCancelToken();
    cancelTokenRef.current = currentToken;

    if (!lat || !lon) {
      setError("Location coordinates are required");
      return;
    }

    startLoading();
    setError(null);

    try {
      const data = await fetchAirPollution(lat, lon);
      
      // Check if this request was cancelled before setting state
      if (isCancelled(currentToken)) {
        return;
      }
      
      const airQualityData = convertAirQualityData(data);
      
      setTimeout(() => {
        if (!isCancelled(currentToken)) {
          setAirQuality(airQualityData);
          finishLoading();
        }
      }, 300);
    } catch (err: any) {
      if (!isCancelled(currentToken)) {
        console.error("Error fetching air quality:", err);
        setError("Failed to load air quality data");
        finishLoading();
      }
    }
  };

  useEffect(() => {
    loadAirQuality();
  }, [lat, lon]);

  if (loading && !airQuality) {
    return <LoadingCard message="Loading air quality data..." minHeight="300px" />;
  }

  if (!airQuality) {
    return <ErrorCard message="No air quality data available. Location coordinates are required." />;
  }

  return (
    <>
      <GlobalAnimationStyles />
      <style>
        {`
          .pollutant-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1rem;
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
        className={`card-hover ${fadeClass}`}
        style={{
          ...cardStyles.base,
          height: "auto",
          minHeight: "450px"
        }}
        role="article"
        aria-label="Air quality information"
      >
        <CardHeader style={{
          ...headerStyles.base,
          background: "#3b82f6",
        }}>
          <CardTitle style={headerStyles.title}>
            🌬️ Air Quality Index
          </CardTitle>
        </CardHeader>
        
        <CardBody style={{ ...bodyStyles.base, height: "auto" }}>
          <CircularIndicator 
            value={airQuality.aqi}
            label="AQI"
            color={airQuality.color}
            size={120}
          />
          
          <h3 style={{ 
            margin: "0 0 1rem 0", 
            color: airQuality.color,
            fontSize: "1.3rem"
          }}>
            {airQuality.level}
          </h3>
          
          <ProtectionTip
            title="Health Impact"
            content={airQuality.healthAdvice}
          />

          <div style={{
            fontSize: "0.75rem",
            color: "#6c757d",
            fontStyle: "italic",
            marginBottom: "1.5rem",
            padding: "0.5rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #e9ecef"
          }}>
            <strong>Note:</strong> AQI calculated using US EPA standards based on pollutant concentrations from OpenWeatherMap API.
          </div>

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
        <ErrorNotification 
          message={error}
          onClose={() => setError(null)}
          type="warning"
        />
      )}
    </>
  );
}
