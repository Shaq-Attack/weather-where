import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle } from '@progress/kendo-react-layout';
import { ArcGauge } from '@progress/kendo-react-gauges';
import { Chart, ChartSeries, ChartSeriesItem, ChartLegend, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Loader } from '@progress/kendo-react-indicators';
import { fetchUVIndex, getCurrentUVIndex } from '../api/openWeather';
import '@progress/kendo-theme-material/dist/all.css';

interface WeatherDashboardCardsProps {
  weatherData: any;
  isCelsius: boolean;
  lat?: number;
  lon?: number;
}

export const WeatherDashboardCards: React.FC<WeatherDashboardCardsProps> = ({
  weatherData,
  isCelsius,
  lat,
  lon
}) => {
  // UV Index state management
  const [uvIndex, setUvIndex] = useState<number>(0);
  const [uvLoading, setUvLoading] = useState<boolean>(true);
  const [uvError, setUvError] = useState<string | null>(null);

  // Load UV Index data
  useEffect(() => {
    let cancelled = false; // Prevent race conditions
    
    const loadUVData = async () => {
      if (!lat || !lon) {
        setUvLoading(false);
        return;
      }

      try {
        setUvLoading(true);
        setUvError(null);
        
        console.log('Loading UV data for coordinates:', { lat, lon });
        
        const uvData = await fetchUVIndex(lat, lon);
        
        // Check if this request was cancelled
        if (cancelled) {
          console.log('UV request cancelled for:', { lat, lon });
          return;
        }
        
        const currentUV = getCurrentUVIndex(uvData);
        console.log('UV data loaded successfully:', { lat, lon, currentUV });
        
        setUvIndex(currentUV);
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching UV data for:', { lat, lon }, error);
          setUvError('Failed to load UV data');
          setUvIndex(0);
        }
      } finally {
        if (!cancelled) {
          setUvLoading(false);
        }
      }
    };

    loadUVData();
    
    // Cleanup function to cancel the request
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);
  if (!weatherData) {
    return (
      <div className="dashboard-grid">
        <Card style={{ padding: 20, textAlign: 'center' }}>
          <CardBody>
            <p>Loading weather data...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const current = weatherData.current;
  const hourly = weatherData.hourly?.slice(0, 24) || [];

  // Prepare chart data
  // Format hour labels for x-axis
  const temperatureChartData = hourly.map((hour: any) => {
    const date = new Date((hour.dt || 0) * 1000);
    const hourLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      time: hourLabel,
      temperature: Math.round(hour.temp),
      humidity: hour.humidity
    };
  });

  const visibility = current?.visibility || 0;
  const windSpeed = current?.wind_speed || 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          padding: 0;
          max-width: 100%;
          min-height: 100vh;
          height: auto;
        }

        .dashboard-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(230, 236, 245, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
          height: auto;
          min-height: 100vh;
        }

        .main-dashboard-card {
          display: grid;
          grid-template-rows: auto 1fr;
          min-height: 100vh;
          height: auto;
          overflow: visible;
        }

        .card-header {
          padding: 24px 24px 20px 24px;
          border-bottom: none;
          flex-shrink: 0;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .card-subtitle {
          font-size: 1rem;
          opacity: 0.7;
          margin: 4px 0 0 0;
          line-height: 1.2;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: minmax(350px, auto) minmax(400px, 1fr);
          gap: 20px;
          padding: 20px;
          overflow: visible;
          height: auto;
          min-height: calc(100vh - 140px);
        }

        .current-weather-section {
          grid-column: span 1;
          grid-row: 1;
          display: flex;
          flex-direction: column;
        }

        .environmental-metrics-section {
          grid-column: span 1;
          grid-row: 1;
          display: flex;
          flex-direction: column;
        }

        .uv-index-section {
          grid-column: span 1;
          grid-row: 1;
          display: flex;
          flex-direction: column;
        }

        .temperature-chart-section {
          grid-column: span 3;
          grid-row: 2;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          overflow: visible;
          height: auto;
        }

        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: height 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .dashboard-card:hover::before {
          height: 6px;
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
        }

        .card-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
          opacity: 0.5;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          letter-spacing: -0.5px;
        }

        .card-subtitle {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 6px 0 0 0;
          position: relative;
          z-index: 1;
          font-weight: 500;
        }

        .card-body {
          padding: 24px;
        }

        .current-weather-display {
          text-align: center;
          padding: 24px 0;
        }

        .temperature-main {
          font-size: 4.5rem;
          font-weight: 200;
          color: #2c3e50;
          margin: 0;
          line-height: 1;
          letter-spacing: -2px;
        }

        .weather-condition {
          font-size: 1.3rem;
          color: #6c757d;
          margin: 12px 0;
          text-transform: capitalize;
          font-weight: 500;
        }

        .weather-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 18px;
          margin-top: 24px;
        }

        .detail-item {
          text-align: center;
          padding: 16px 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid rgba(230, 236, 245, 0.6);
        }

        .detail-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }

        .detail-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 6px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .gauge-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          min-height: 200px;
        }

        .chart-container {
          height: 280px;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          margin: 8px;
        }

        .grid-container {
          height: 320px;
          margin: 8px;
        }

        .progress-section {
          margin: 20px 0;
          padding: 16px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          border: 1px solid rgba(230, 236, 245, 0.6);
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: #495057;
          font-weight: 600;
        }

        .large-card {
          grid-column: span 2;
        }

        .medium-card {
          grid-column: span 1;
        }

        /* Quick stats grid for animated card */
        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-tile {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          border-left: 4px solid;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(230, 236, 245, 0.6);
        }

        .stat-tile::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .stat-tile:hover::before {
          left: 100%;
        }

        .stat-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }

        .stat-title {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 6px;
          line-height: 1;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: #28a745;
          font-weight: 600;
        }

        /* Enhanced KendoReact component styling */
        .k-progressbar {
          background: rgba(230, 236, 245, 0.8) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          height: 8px !important;
        }

        .k-progressbar .k-progress {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 12px !important;
        }

        .k-grid {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
        }

        .k-grid-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border: none !important;
        }

        .k-grid-header .k-header {
          background: transparent !important;
          color: white !important;
          border: none !important;
          font-weight: 600 !important;
          padding: 12px 16px !important;
        }

        .k-grid-content {
          border: none !important;
        }

        .k-grid tr {
          border-bottom: 1px solid rgba(230, 236, 245, 0.6) !important;
        }

        .k-grid td {
          padding: 12px 16px !important;
          border: none !important;
        }

        /* Chart styling */
        .k-chart {
          background: transparent !important;
          border: none !important;
        }

        /* Gauge styling */
        .k-arcgauge,
        .k-lineargauge {
          background: transparent !important;
        }

        @media (max-width: 1400px) {
          .large-card {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .temperature-main {
            font-size: 3.5rem;
          }
          
          .weather-details {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .detail-item {
            padding: 12px 8px;
          }
          
          .card-body {
            padding: 20px;
          }
          
          .chart-container {
            height: 240px;
          }
          
          .grid-container {
            height: 280px;
          }

          .quick-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .stat-tile {
            padding: 16px;
          }
          
          .stat-value {
            font-size: 1.6rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-grid {
            gap: 16px;
          }
          
          .card-body {
            padding: 16px;
          }
          
          .temperature-main {
            font-size: 3rem;
          }
          
          .weather-details {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}} />

      <div className="dashboard-grid">
        {/* Single Unified Weather Dashboard Card */}
        <Card className="dashboard-card main-dashboard-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Weather Dashboard</CardTitle>
            <CardSubtitle className="card-subtitle">
              Complete weather overview and analytics
            </CardSubtitle>
          </CardHeader>
          <CardBody className="card-body" style={{ padding: 0, height: '100%' }}>
            <div className="dashboard-content">
              
              {/* Current Weather Overview */}
              <div 
                className="current-weather-section"
                style={{ 
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(230, 236, 245, 0.8)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  marginBottom: '16px'
                }}>
                  Current Weather Overview
                </h3>
                
                <div className="current-weather-display">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {current?.weather?.[0]?.main === 'Clear' ? '☀️' : 
                     current?.weather?.[0]?.main?.includes('Cloud') ? '☁️' : 
                     current?.weather?.[0]?.main?.includes('Rain') ? '🌧️' : 
                     '🌤️'}
                  </div>
                  <h1 className="temperature-main">
                    {Math.round(current?.main?.temp || 0)}°{isCelsius ? 'C' : 'F'}
                  </h1>
                  <p className="weather-condition">
                    {current?.weather?.[0]?.description || 'No data'}
                  </p>
                  <div className="weather-details" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div className="detail-item">
                      <div className="detail-label">Feels like</div>
                      <div className="detail-value">
                        {Math.round(current?.main?.feels_like || 0)}°
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Humidity</div>
                      <div className="detail-value">{current?.main?.humidity || 0}%</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Pressure</div>
                      <div className="detail-value">{current?.main?.pressure || 0} hPa</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Wind Speed</div>
                      <div className="detail-value">
                        {Math.round(windSpeed)} {isCelsius ? 'm/s' : 'mph'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Metrics */}
              <div 
                className="environmental-metrics-section"
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  padding: '24px',
                  border: '1px solid rgba(230, 236, 245, 0.8)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '700' }}>Environmental Metrics</h3>
                <div className="progress-section">
                  <div className="progress-label">
                    <span>Visibility</span>
                    <span>{Math.round((visibility || 10000) / 1000)} km</span>
                  </div>
                  <ProgressBar 
                    value={(visibility || 10000) / 100} 
                    max={100}
                  />
                </div>
                
                <div className="progress-section">
                  <div className="progress-label">
                    <span>Humidity</span>
                    <span>{current?.main?.humidity || 0}%</span>
                  </div>
                  <ProgressBar 
                    value={current?.main?.humidity || 0} 
                    max={100}
                  />
                </div>

                <div className="progress-section">
                  <div className="progress-label">
                    <span>Cloud Cover</span>
                    <span>{current?.clouds?.all || 0}%</span>
                  </div>
                  <ProgressBar 
                    value={current?.clouds?.all || 0} 
                    max={100}
                  />
                </div>
              </div>

              {/* UV Index Gauge */}
              <div 
                className="uv-index-section"
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  padding: '24px',
                  border: '1px solid rgba(230, 236, 245, 0.8)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '700' }}>UV Index</h3>
                {uvLoading ? (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '150px',
                    flexDirection: 'column'
                  }}>
                    <Loader type="infinite-spinner" />
                    <span style={{ marginTop: '8px', fontSize: '0.9rem', color: '#6c757d' }}>
                      Loading UV data...
                    </span>
                  </div>
                ) : uvError ? (
                  <div style={{ 
                    textAlign: 'center', 
                    minHeight: '150px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    color: '#6c757d'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
                    <div style={{ fontSize: '0.9rem' }}>{uvError}</div>
                  </div>
                ) : uvIndex === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    minHeight: '150px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    color: '#6c757d'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌙</div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '4px' }}>No UV Risk</div>
                    <div style={{ fontSize: '0.85rem' }}>UV Index not available<br/>during nighttime hours</div>
                  </div>
                ) : (
                  <>
                    <div className="gauge-container" style={{ minHeight: '150px' }}>
                      <ArcGauge
                        value={uvIndex}
                        scale={{
                          min: 0,
                          max: 11,
                          majorTicks: {
                            visible: true
                          },
                          labels: {
                            visible: true
                          }
                        }}
                        colors={[
                          { from: 0, to: 2, color: '#289500' },
                          { from: 3, to: 5, color: '#f7e400' },
                          { from: 6, to: 7, color: '#f85900' },
                          { from: 8, to: 10, color: '#d8001d' },
                          { from: 11, to: 11, color: '#6b49c8' }
                        ]}
                      />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                      <strong style={{ fontSize: '1.2rem' }}>{uvIndex}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>
                        {uvIndex === 0 ? 'No Risk' :
                         uvIndex <= 2 ? 'Low Risk' :
                         uvIndex <= 5 ? 'Moderate Risk' :
                         uvIndex <= 7 ? 'High Risk' :
                         uvIndex <= 10 ? 'Very High Risk' : 'Extreme Risk'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Temperature Trend Chart */}
              <div 
                className="temperature-chart-section"
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  padding: '24px',
                  border: '1px solid rgba(230, 236, 245, 0.8)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  fontSize: '1.2rem', 
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  24-Hour Temperature & Humidity Trend
                </h3>
                <div 
                  className="chart-container" 
                  style={{ 
                    height: 'calc(100% - 60px)',
                    minHeight: '300px',
                    overflow: 'hidden',
                    flex: 1
                  }}
                >
                  <Chart style={{ height: '100%', width: '100%' }}>
                    <ChartCategoryAxis>
                      <ChartCategoryAxisItem
                        labels={{ rotation: 'auto', step: 2 }}
                        majorGridLines={{ visible: false }}
                        title={{ text: 'Hour' }}
                        categories={temperatureChartData.map((d: { time: string }) => d.time)}
                      />
                    </ChartCategoryAxis>
                    <ChartValueAxis>
                      <ChartValueAxisItem
                        name="temperature"
                        title={{ text: `Temperature (°${isCelsius ? 'C' : 'F'})` }}
                        min={Math.min(...temperatureChartData.map((d: { temperature: number }) => d.temperature)) - 2}
                        max={Math.max(...temperatureChartData.map((d: { temperature: number }) => d.temperature)) + 2}
                      />
                      <ChartValueAxisItem
                        name="humidity"
                        title={{ text: 'Humidity (%)' }}
                        min={0}
                        max={100}
                        visible={false}
                      />
                    </ChartValueAxis>
                    <ChartSeries>
                      <ChartSeriesItem
                        type="line"
                        data={temperatureChartData}
                        field="temperature"
                        categoryField="time"
                        name="Temperature"
                        color="#667eea"
                        axis="temperature"
                        markers={{ visible: true, size: 6 }}
                      />
                      <ChartSeriesItem
                        type="line"
                        data={temperatureChartData}
                        field="humidity"
                        categoryField="time"
                        name="Humidity"
                        color="#00bcd4"
                        axis="humidity"
                        markers={{ visible: true, size: 6 }}
                        dashType="dot"
                      />
                    </ChartSeries>
                    <ChartLegend visible={true} position="bottom" />
                    <ChartTooltip shared={true} />
                  </Chart>
                </div>
              </div>

            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
