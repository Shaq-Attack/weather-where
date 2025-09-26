import React from "react";
import { Card } from "@progress/kendo-react-layout";
import { WeatherData } from "../../hooks/useWeather";

interface HourlyScreenProps {
  weatherData: WeatherData | null;
  isCelsius: boolean;
}

export const HourlyScreen: React.FC<HourlyScreenProps> = ({
  weatherData,
  isCelsius,
}) => {
  if (!weatherData) {
    return (
      <div className="hourly-container">
        <div className="no-data-message">
          <h2>No Weather Data Available</h2>
          <p>Please select a location to view the hourly forecast.</p>
        </div>
      </div>
    );
  }

  const getHourFormat = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  const getDayFormat = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
  };

  // Group hourly data by day
  const groupByDay = () => {
    const groups: { [key: string]: typeof weatherData.hourly } = {};

    weatherData.hourly.slice(0, 24).forEach((hour) => {
      // Show next 24 hours
      const dayKey = getDayFormat(hour.dt);
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(hour);
    });

    return groups;
  };

  const hourlyGroups = groupByDay();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hourly-container {
          padding: 24px;
          height: 100%;
          overflow-y: auto;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .hourly-header {
          text-align: center;
          margin-bottom: 32px;
          padding: 32px 24px;
          background: #3b82f6;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
        }

        .hourly-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .hourly-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        .hourly-day-section {
          margin-bottom: 32px;
        }

        .hourly-day-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #ffffffff;
          margin-bottom: 16px;
          padding-left: 8px;
        }

        .hourly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .hourly-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid rgba(230, 236, 245, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
        }

        .hourly-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .hourly-time {
          font-size: 1.1rem;
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 12px;
        }

        .hourly-weather-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .hourly-temp {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .hourly-feels {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 12px;
        }

        .hourly-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hourly-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #495057;
        }

        .hourly-detail-icon {
          font-size: 0.9rem;
          width: 16px;
          text-align: center;
        }

        .no-data-message {
          text-align: center;
          padding: 80px 24px;
          color: #6c757d;
        }

        .no-data-message h2 {
          font-size: 2rem;
          margin-bottom: 16px;
          color: #495057;
        }

        @media (max-width: 768px) {
          .hourly-container {
            padding: 16px;
          }

          .hourly-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }

          .hourly-title {
            font-size: 2rem;
          }

          .hourly-card {
            padding: 16px;
          }
        }
      `,
        }}
      />

      <div className="hourly-header">
        <h1 className="hourly-title">⏰ Hourly Forecast</h1>
        <p className="hourly-subtitle">
          Hour-by-hour weather conditions for the next 24 hours
        </p>
      </div>

      {Object.entries(hourlyGroups).map(([dayName, hours]) => (
        <div key={dayName} className="hourly-day-section">
          <h2 className="hourly-day-title">{dayName}</h2>
          <div className="hourly-grid">
            {hours.map((hour) => (
              <Card key={hour.dt} className="hourly-card">
                <div className="hourly-time">{getHourFormat(hour.dt)}</div>

                <div className="hourly-weather-icon">
                  {hour.weather.main === "Clear" && "☀️"}
                  {hour.weather.main === "Clouds" && "☁️"}
                  {hour.weather.main === "Rain" && "🌧️"}
                  {hour.weather.main === "Snow" && "❄️"}
                  {hour.weather.main === "Thunderstorm" && "⛈️"}
                  {hour.weather.main === "Drizzle" && "🌦️"}
                  {hour.weather.main === "Mist" && "🌫️"}
                  {![
                    "Clear",
                    "Clouds",
                    "Rain",
                    "Snow",
                    "Thunderstorm",
                    "Drizzle",
                    "Mist",
                  ].includes(hour.weather.main) && "🌤️"}
                </div>

                <div className="hourly-temp">
                  {Math.round(hour.temp)}°{isCelsius ? "C" : "F"}
                </div>

                <div className="hourly-feels">
                  Feels {Math.round(hour.feels_like)}°
                </div>

                <div className="hourly-details">
                  <div className="hourly-detail">
                    <span>
                      <span className="hourly-detail-icon">💧</span> Humidity
                    </span>
                    <span>{hour.humidity}%</span>
                  </div>
                  <div className="hourly-detail">
                    <span>
                      <span className="hourly-detail-icon">💨</span> Wind
                    </span>
                    <span>
                      {Math.round(hour.wind.speed)} {isCelsius ? "m/s" : "mph"}
                    </span>
                  </div>
                  <div className="hourly-detail">
                    <span>
                      <span className="hourly-detail-icon">🌧️</span> Rain
                    </span>
                    <span>{Math.round(hour.pop * 100)}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
