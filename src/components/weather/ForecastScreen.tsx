import React from 'react';
import { Card } from '@progress/kendo-react-layout';
import { WeatherData } from '../../hooks/useWeather';

interface ForecastScreenProps {
  weatherData: WeatherData | null;
  isCelsius: boolean;
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  weatherData,
  isCelsius
}) => {
  if (!weatherData) {
    return (
      <div className="forecast-container">
        <div className="no-data-message">
          <h2>No Weather Data Available</h2>
          <p>Please select a location to view the forecast.</p>
        </div>
      </div>
    );
  }

  const getDayName = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .forecast-container {
          padding: 24px;
          height: 100%;
          overflow-y: auto;
          background: linear-gradient(135deg, #ff0000ff 0%, #0080ffff 100%);
        }

        .forecast-header {
          text-align: center;
          margin-bottom: 32px;
          padding: 32px 24px;
          background: #3b82f6;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
        }

        .forecast-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .forecast-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .forecast-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          border: 1px solid rgba(230, 236, 245, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .forecast-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .forecast-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #2563eb, #1d4ed8, #1e40af);
          background-size: 300% 100%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .forecast-day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .forecast-day-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .forecast-date {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
        }

        .forecast-main-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .forecast-temps {
          display: flex;
          flex-direction: column;
        }

        .forecast-high {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .forecast-low {
          font-size: 1.2rem;
          color: #6c757d;
          font-weight: 500;
          margin: 4px 0 0 0;
        }

        .forecast-weather-icon {
          font-size: 3rem;
          margin-left: 16px;
        }

        .forecast-description {
          font-size: 1rem;
          color: #495057;
          font-weight: 500;
          text-transform: capitalize;
          margin-bottom: 20px;
        }

        .forecast-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .forecast-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #495057;
        }

        .forecast-detail-icon {
          font-size: 1rem;
          color: #3b82f6;
          width: 20px;
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
          .forecast-container {
            padding: 16px;
          }

          .forecast-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .forecast-title {
            font-size: 2rem;
          }

          .forecast-card {
            padding: 20px;
          }
        }
      `}} />

        <div className="forecast-header">
          <h1 className="forecast-title">🌤️ 7-Day Forecast</h1>
          <p className="forecast-subtitle">
            Detailed weather forecast for the next week
          </p>
        </div>

        <div className="forecast-grid">
          {weatherData.daily.map((day, index) => {
            const isToday = index === 0;
            const dayName = isToday ? 'Today' : getDayName(day.dt);
            
            return (
              <Card key={day.dt} className="forecast-card">
                <div className="forecast-day-header">
                  <div className="forecast-day-name">{dayName}</div>
                  <div className="forecast-date">{getFormattedDate(day.dt)}</div>
                </div>

                <div className="forecast-main-info">
                  <div className="forecast-temps">
                    <div className="forecast-high">
                      {Math.round(day.temp.max)}°{isCelsius ? 'C' : 'F'}
                    </div>
                    <div className="forecast-low">
                      Low: {Math.round(day.temp.min)}°{isCelsius ? 'C' : 'F'}
                    </div>
                  </div>
                  <div className="forecast-weather-icon">
                    {day.weather[0].main === 'Clear' && '☀️'}
                    {day.weather[0].main === 'Clouds' && '☁️'}
                    {day.weather[0].main === 'Rain' && '🌧️'}
                    {day.weather[0].main === 'Snow' && '❄️'}
                    {day.weather[0].main === 'Thunderstorm' && '⛈️'}
                    {day.weather[0].main === 'Drizzle' && '🌦️'}
                    {day.weather[0].main === 'Mist' && '🌫️'}
                    {!['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'].includes(day.weather[0].main) && '🌤️'}
                  </div>
                </div>

                <div className="forecast-description">
                  {day.weather[0].description}
                </div>

                <div className="forecast-details">
                  <div className="forecast-detail-item">
                    <span className="forecast-detail-icon">💧</span>
                    <span>Humidity: {day.humidity}%</span>
                  </div>
                  <div className="forecast-detail-item">
                    <span className="forecast-detail-icon">💨</span>
                    <span>Wind: {Math.round(day.wind.speed)} {isCelsius ? 'm/s' : 'mph'}</span>
                  </div>
                  <div className="forecast-detail-item">
                    <span className="forecast-detail-icon">🌧️</span>
                    <span>Rain Chance: {Math.round(day.pop * 100)}%</span>
                  </div>
                  <div className="forecast-detail-item">
                    <span className="forecast-detail-icon">🌡️</span>
                    <span>Feels Like: {Math.round(day.temp.day)}°{isCelsius ? 'C' : 'F'}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
    </>
  );
};
