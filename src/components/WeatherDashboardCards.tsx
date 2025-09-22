import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle } from '@progress/kendo-react-layout';
import { ArcGauge, LinearGauge } from '@progress/kendo-react-gauges';
import { Chart, ChartSeries, ChartSeriesItem, ChartLegend } from '@progress/kendo-react-charts';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import '@progress/kendo-theme-material/dist/all.css';

interface WeatherDashboardCardsProps {
  weatherData: any;
  isCelsius: boolean;
}

export const WeatherDashboardCards: React.FC<WeatherDashboardCardsProps> = ({
  weatherData,
  isCelsius
}) => {
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
  const forecast = weatherData.daily?.slice(0, 7) || [];
  const hourly = weatherData.hourly?.slice(0, 24) || [];

  // Prepare chart data
  const temperatureChartData = hourly.map((hour: any, index: number) => ({
    time: index,
    temperature: Math.round(hour.temp),
    humidity: hour.humidity
  }));

  const weeklyForecastData = forecast.map((day: any) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day.dt * 1000).getDay()],
    high: Math.round(day.temp.max),
    low: Math.round(day.temp.min),
    humidity: day.humidity
  }));

  const uvIndex = current?.uvi || 0;
  const visibility = current?.visibility || 0;
  const windSpeed = current?.wind_speed || 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          padding: 0;
          max-width: 100%;
        }

        .dashboard-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(230, 236, 245, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
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
        {/* Current Weather Overview */}
        <Card className="dashboard-card large-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Current Weather</CardTitle>
            <CardSubtitle className="card-subtitle">
              {current?.name || 'Unknown Location'}
            </CardSubtitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="current-weather-display">
              <h1 className="temperature-main">
                {Math.round(current?.main?.temp || 0)}°{isCelsius ? 'C' : 'F'}
              </h1>
              <p className="weather-condition">
                {current?.weather?.[0]?.description || 'No data'}
              </p>
              <div className="weather-details">
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
          </CardBody>
        </Card>

        {/* Temperature Trend Chart */}
        <Card className="dashboard-card large-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">24-Hour Temperature Trend</CardTitle>
            <CardSubtitle className="card-subtitle">Hourly forecast</CardSubtitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="chart-container">
              <Chart>
                <ChartSeries>
                  <ChartSeriesItem
                    type="line"
                    data={temperatureChartData}
                    field="temperature"
                    categoryField="time"
                    name="Temperature"
                    color="#667eea"
                  />
                </ChartSeries>
                <ChartLegend visible={false} />
              </Chart>
            </div>
          </CardBody>
        </Card>

        {/* UV Index Gauge */}
        <Card className="dashboard-card medium-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">UV Index</CardTitle>
            <CardSubtitle className="card-subtitle">Current exposure level</CardSubtitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="gauge-container">
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
                  { from: 0, to: 2, color: '#00ff00' },
                  { from: 3, to: 5, color: '#ffff00' },
                  { from: 6, to: 7, color: '#ff8c00' },
                  { from: 8, to: 10, color: '#ff0000' },
                  { from: 11, to: 11, color: '#8b00ff' }
                ]}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <strong>{uvIndex.toFixed(1)}</strong>
            </div>
          </CardBody>
        </Card>

        {/* Wind Speed Gauge */}
        <Card className="dashboard-card medium-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Wind Speed</CardTitle>
            <CardSubtitle className="card-subtitle">Current conditions</CardSubtitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="gauge-container">
              <LinearGauge
                scale={{
                  min: 0,
                  max: 100,
                  majorTicks: {
                    visible: true
                  }
                }}
                pointer={{
                  value: windSpeed,
                  color: "#667eea"
                }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 15 }}>
              <strong>{windSpeed.toFixed(1)} {isCelsius ? 'm/s' : 'mph'}</strong>
            </div>
          </CardBody>
        </Card>

        {/* Environmental Metrics */}
        <Card className="dashboard-card medium-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Environmental Metrics</CardTitle>
            <CardSubtitle className="card-subtitle">Air quality indicators</CardSubtitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="progress-section">
              <div className="progress-label">
                <span>Visibility</span>
                <span>{(visibility / 1000).toFixed(1)} km</span>
              </div>
              <ProgressBar 
                value={(visibility / 10000) * 100} 
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
          </CardBody>
        </Card>

        {/* Weekly Forecast Grid */}
        <Card className="dashboard-card large-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">7-Day Forecast</CardTitle>
            <CardSubtitle className="card-subtitle">Weekly weather outlook</CardSubtitle>
          </CardHeader>
          <CardBody className="card-body">
            <div className="grid-container">
              <Grid
                data={weeklyForecastData}
                style={{ height: '100%' }}
              >
                <GridColumn field="day" title="Day" width="80px" />
                <GridColumn 
                  field="high" 
                  title={`High (°${isCelsius ? 'C' : 'F'})`} 
                  width="100px" 
                />
                <GridColumn 
                  field="low" 
                  title={`Low (°${isCelsius ? 'C' : 'F'})`} 
                  width="100px" 
                />
                <GridColumn 
                  field="humidity" 
                  title="Humidity %" 
                  width="100px" 
                />
              </Grid>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
