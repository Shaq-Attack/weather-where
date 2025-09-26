import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  fetchWeather,
  fetchForecast,
  convertToDaily,
  ForecastDay,
} from "../../api/openWeather";

interface WeatherInsightsProps {
  lat?: number | null;
  lon?: number | null;
}

interface WeatherInsightsData {
  temperatureTrend: string;
  precipitationForecast: string;
  windAdvisory: string;
  loading: boolean;
  error?: string;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({
  lat,
  lon,
}) => {
  // Add card style for lighter background
  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(230, 236, 245, 0.8)",
  };
  const [insights, setInsights] = useState<WeatherInsightsData>({
    temperatureTrend: "Loading temperature data...",
    precipitationForecast: "Loading precipitation data...",
    windAdvisory: "Loading wind data...",
    loading: true,
  });

  const calculateTemperatureTrend = (dailyData: ForecastDay[]): string => {
    if (dailyData.length < 2)
      return "Insufficient data for temperature trend analysis.";

    const today = dailyData[0];
    const nextFewDays = dailyData.slice(1, 4); // Next 3 days

    const avgTempNextDays =
      nextFewDays.reduce((sum, day) => sum + day.temp.day, 0) /
      nextFewDays.length;
    const tempDifference = avgTempNextDays - today.temp.day;

    if (Math.abs(tempDifference) < 2) {
      return `Stable temperatures around ${Math.round(today.temp.day)}°C. No significant changes expected.`;
    } else if (tempDifference > 0) {
      return `Warming trend: temperatures rising by ${Math.round(tempDifference)}°C over the next few days.`;
    } else {
      return `Cooling trend: temperatures dropping by ${Math.round(Math.abs(tempDifference))}°C over the next few days.`;
    }
  };

  const calculatePrecipitationForecast = (dailyData: ForecastDay[]): string => {
    if (dailyData.length === 0) return "No precipitation data available.";

    const today = dailyData[0];
    const nextWeek = dailyData.slice(0, 5); // Next 5 days

    const maxPrecipChance = Math.max(...nextWeek.map((day) => day.pop * 100));
    const rainyDays = nextWeek.filter((day) => day.pop > 0.3).length;

    if (maxPrecipChance < 15) {
      return "Clear skies ahead! No significant precipitation expected this week.";
    } else if (rainyDays === 1) {
      return `${Math.round(today.pop * 100)}% chance of rain today. Mostly clear conditions ahead.`;
    } else {
      return `${Math.round(maxPrecipChance)}% chance of precipitation. Expect ${rainyDays} days with possible rain this week.`;
    }
  };

  const calculateWindAdvisory = (
    currentWeather: any,
    dailyData: ForecastDay[],
  ): string => {
    if (!currentWeather || dailyData.length === 0)
      return "Wind data unavailable.";

    const currentWindSpeed = currentWeather.wind?.speed || 0;

    // Convert m/s to km/h for better understanding
    const currentWindKmh = Math.round(currentWindSpeed * 3.6);

    if (currentWindKmh < 10) {
      return "Light winds. Perfect conditions for outdoor activities.";
    } else if (currentWindKmh < 25) {
      return `Moderate winds at ${currentWindKmh} km/h. Good conditions for most outdoor activities.`;
    } else if (currentWindKmh < 40) {
      return `Strong winds at ${currentWindKmh} km/h. Consider indoor activities or secure outdoor items.`;
    } else {
      return `Very strong winds at ${currentWindKmh} km/h. Avoid outdoor activities and secure loose objects.`;
    }
  };

  const fetchWeatherInsights = async () => {
    if (!lat || !lon) {
      setInsights({
        temperatureTrend: "Location data required for weather insights.",
        precipitationForecast:
          "Location data required for precipitation forecast.",
        windAdvisory: "Location data required for wind advisory.",
        loading: false,
        error: "No location provided",
      });
      return;
    }

    try {
      setInsights((prev) => ({ ...prev, loading: true, error: undefined }));

      // Fetch current weather and forecast data
      const [currentWeather, forecastData] = await Promise.all([
        fetchWeather(lat, lon),
        fetchForecast(lat, lon),
      ]);

      // Always using 5-day/3-hour forecast response now (free tier)
      const dailyData = convertToDaily(forecastData);

      const temperatureTrend = calculateTemperatureTrend(dailyData);
      const precipitationForecast = calculatePrecipitationForecast(dailyData);
      const windAdvisory = calculateWindAdvisory(currentWeather, dailyData);

      setInsights({
        temperatureTrend,
        precipitationForecast,
        windAdvisory,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching weather insights:", error);
      setInsights({
        temperatureTrend: "Error loading temperature data.",
        precipitationForecast: "Error loading precipitation data.",
        windAdvisory: "Error loading wind data.",
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  useEffect(() => {
    fetchWeatherInsights();
  }, [lat, lon]);

  const handleRefresh = () => {
    fetchWeatherInsights();
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      location: { lat, lon },
      insights: {
        temperatureTrend: insights.temperatureTrend,
        precipitationForecast: insights.precipitationForecast,
        windAdvisory: insights.windAdvisory,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `weather-insights-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        .widget-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
          border: none !important;
        }
        .widget-header {
          background: #3b82f6 !important;
          border-radius: 8px 8px 0 0 !important;
          color: white !important;
          position: relative;
        }
        .widget-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
          opacity: 0.5;
          border-radius: 16px 16px 0 0;
          pointer-events: none;
        }
        .widget-title {
          color: white !important;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .widget-body {
          background: transparent !important;
        }
        .weather-tip {
          background: white;
          border-radius: 12px;
          margin-bottom: 16px;
          padding: 16px 18px;
          border-left: 4px solid #3b82f6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .tip-title {
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 6px;
        }
        .tip-content {
          color: #2c3e50;
          font-size: 1rem;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }
        .action-btn {
          background: #3b82f6 !important;
          color: white !important;
          border-radius: 6px !important;
          font-weight: 500;
          border: none !important;
        }
        .action-btn:disabled {
          background: #9ca3af !important;
          color: #f8f9fa !important;
        }
      `}</style>
      <Card className="widget-card" style={cardStyle}>
        <CardHeader className="widget-header">
          <CardTitle className="widget-title">Weather Insights</CardTitle>
        </CardHeader>
        <CardBody className="widget-body">
          <div className="weather-tip">
            <div className="tip-title">🌡️ Temperature Trend</div>
            <div className="tip-content">
              {insights.loading
                ? "Loading temperature data..."
                : insights.temperatureTrend}
            </div>
          </div>

          <div className="weather-tip">
            <div className="tip-title">🌧️ Precipitation Forecast</div>
            <div className="tip-content">
              {insights.loading
                ? "Loading precipitation data..."
                : insights.precipitationForecast}
            </div>
          </div>

          <div className="weather-tip">
            <div className="tip-title">💨 Wind Advisory</div>
            <div className="tip-content">
              {insights.loading
                ? "Loading wind data..."
                : insights.windAdvisory}
            </div>
          </div>

          {insights.error && (
            <div className="weather-tip" style={{ borderLeftColor: "#dc3545" }}>
              <div className="tip-title">⚠️ Error</div>
              <div className="tip-content">
                {insights.error}. Please check your API key and location data.
              </div>
            </div>
          )}

          <div className="action-buttons">
            <Button
              className="action-btn"
              icon="refresh"
              onClick={handleRefresh}
              disabled={insights.loading}
            >
              {insights.loading ? "Loading..." : "Refresh"}
            </Button>
            <Button
              className="action-btn"
              icon="download"
              onClick={handleExport}
              disabled={insights.loading}
            >
              Export
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
