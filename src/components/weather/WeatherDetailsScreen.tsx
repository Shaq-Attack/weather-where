import React, { useState, useMemo } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { formatTime } from '../../utils/time';

interface HourlyWeatherRow {
  id: number;
  time: string;
  hour: string;
  temperature: number;
  temperatureDisplay: string;
  feelsLike: number;
  feelsLikeDisplay: string;
  condition: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number;
  windDisplay: string;
  precipitationChance: number;
  precipitationDisplay: string;
  rawData: any; // Full hourly data for popup
}

interface WeatherDetailPopupProps {
  hourData: any;
  isCelsius: boolean;
  onClose: () => void;
}

const WeatherDetailPopup: React.FC<WeatherDetailPopupProps> = ({ hourData, isCelsius, onClose }) => {
  if (!hourData) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#2c3e50',
            fontSize: '1.8rem' 
          }}>
            {formatTime(hourData.dt)}
          </h2>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#e74c3c',
            margin: '16px 0'
          }}>
            {Math.round(hourData.temp)}°{isCelsius ? 'C' : 'F'}
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: '#7f8c8d',
            textTransform: 'capitalize',
            marginBottom: '8px'
          }}>
            {hourData.weather.description}
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#95a5a6'
          }}>
            Feels like {Math.round(hourData.feels_like)}°{isCelsius ? 'C' : 'F'}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💧</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3498db' }}>
              {hourData.humidity}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
              Humidity
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💨</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2ecc71' }}>
              {Math.round(hourData.wind.speed)} {isCelsius ? 'm/s' : 'mph'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
              Wind Speed
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌧️</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#9b59b6' }}>
              {Math.round(hourData.pop * 100)}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
              Precipitation
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌡️</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#e67e22' }}>
              {hourData.weather.main}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
              Condition
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WeatherDetailsScreenProps {
  weatherData: any;
  isCelsius: boolean;
  lat?: number;
  lon?: number;
}

export const WeatherDetailsScreen: React.FC<WeatherDetailsScreenProps> = ({
  weatherData,
  isCelsius,
  lat,
  lon
}) => {
  // Always call hooks first - before any conditional returns
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedHour, setSelectedHour] = useState<any>(null);

  // Group hourly data by days (24 hours per page) - hook called unconditionally
  const hourlyByDays = useMemo(() => {
    // Handle case where weatherData or hourly data doesn't exist
    if (!weatherData?.hourly || weatherData.hourly.length === 0) {
      return [];
    }

    const { hourly } = weatherData;
    const days: HourlyWeatherRow[][] = [];
    for (let i = 0; i < hourly.length; i += 24) {
      const dayHours = hourly.slice(i, i + 24).map((hour: any, index: number) => {
        return {
          id: i + index,
          time: formatTime(hour.dt),
          hour: new Date(hour.dt * 1000).getHours().toString().padStart(2, '0') + ':00',
          temperature: Math.round(hour.temp || 0),
          temperatureDisplay: `${Math.round(hour.temp || 0)}°${isCelsius ? 'C' : 'F'}`,
          feelsLike: Math.round(hour.feels_like || 0),
          feelsLikeDisplay: `${Math.round(hour.feels_like || 0)}°${isCelsius ? 'C' : 'F'}`,
          condition: hour.weather?.description || 'N/A',
          conditionIcon: hour.weather?.icon || '',
          humidity: hour.humidity || 0,
          windSpeed: Math.round(hour.wind?.speed || 0),
          windDisplay: `${Math.round(hour.wind?.speed || 0)} ${isCelsius ? 'm/s' : 'mph'}`,
          precipitationChance: Math.round((hour.pop || 0) * 100),
          precipitationDisplay: `${Math.round((hour.pop || 0) * 100)}%`,
          rawData: hour
        };
      });
      days.push(dayHours);
    }
    return days;
  }, [weatherData?.hourly, isCelsius]);

  // Early returns after all hooks are called
  if (!weatherData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        No weather data available. Please select a location.
      </div>
    );
  }

  if (!weatherData.hourly || weatherData.hourly.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        No hourly weather data available.
      </div>
    );
  }

  const currentDayData = hourlyByDays[currentPage] || [];
  const totalPages = hourlyByDays.length;

  const getDayName = (pageIndex: number) => {
    if (pageIndex === 0) return 'Today';
    if (pageIndex === 1) return 'Tomorrow';
    const date = new Date();
    date.setDate(date.getDate() + pageIndex);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleRowClick = (dataItem: HourlyWeatherRow) => {
    setSelectedHour(dataItem.rawData);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .details-container {
          padding: 24px;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .details-header {
          text-align: center;
          margin-bottom: 32px;
          padding: 32px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .details-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .details-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .pagination-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .pagination-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .pagination-button:disabled {
          background: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .day-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 20px;
        }

        .k-grid {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .k-grid-header th {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
          font-weight: 600 !important;
          color: #495057 !important;
          border-bottom: 2px solid #dee2e6 !important;
          padding: 16px 12px !important;
          font-size: 0.9rem !important;
        }

        .k-grid tbody tr {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .k-grid tbody tr:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .k-grid tbody td {
          padding: 16px 12px !important;
          vertical-align: middle !important;
          border-bottom: 1px solid #f1f3f4 !important;
        }

        .time-column {
          font-weight: 600 !important;
          color: #2c3e50 !important;
        }

        .temp-column {
          font-weight: 600 !important;
          font-size: 1.1rem !important;
          color: #e74c3c !important;
        }

        .condition-column {
          text-transform: capitalize;
          color: #495057 !important;
        }

        .humidity-column {
          color: #3498db !important;
          font-weight: 500 !important;
        }

        .wind-column {
          color: #2ecc71 !important;
          font-weight: 500 !important;
        }

        .precip-column {
          color: #9b59b6 !important;
          font-weight: 500 !important;
        }
      `}} />

      <div className="details-container">
        <div className="details-header">
          <h1 className="details-title">Hourly Weather Forecast</h1>
          <p className="details-subtitle">
            📍 {lat?.toFixed(4) || '0.0000'}°, {lon?.toFixed(4) || '0.0000'}°
          </p>
        </div>

        <div className="pagination-controls">
          <button 
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            ← Previous Day
          </button>
          
          <div className="day-title">
            {getDayName(currentPage)}
          </div>
          
          <button 
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next Day →
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          width: '100%'
        }}>
          <Grid
            data={currentDayData}
            style={{
              height: '600px',
              background: 'white',
              border: 'none',
              width: '100%'
            }}
            rowHeight={65}
            onRowClick={(e) => handleRowClick(e.dataItem)}
          >
            <GridColumn 
              field="hour" 
              title="Time" 
              className="time-column"
            />
            <GridColumn 
              field="temperatureDisplay" 
              title="Temperature"
              className="temp-column"
            />
            <GridColumn 
              field="feelsLikeDisplay" 
              title="Feels Like"
              className="temp-column"
            />
            <GridColumn 
              field="condition" 
              title="Condition"
              className="condition-column"
            />
            <GridColumn 
              field="humidity" 
              title="Humidity (%)"
              className="humidity-column"
            />
            <GridColumn 
              field="windDisplay" 
              title="Wind"
              className="wind-column"
            />
            <GridColumn 
              field="precipitationDisplay" 
              title="Rain %"
              className="precip-column"
            />
          </Grid>
        </div>
      </div>

      {selectedHour && (
        <WeatherDetailPopup 
          hourData={selectedHour}
          isCelsius={isCelsius}
          onClose={() => setSelectedHour(null)}
        />
      )}
    </>
  );
};
