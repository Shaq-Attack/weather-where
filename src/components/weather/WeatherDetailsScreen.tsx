import React, { useState, useMemo } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { formatTime } from "../../utils/time";

interface HourlyWeatherRow {
  id: number;
  time: string;
  dateTime: string;
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

const WeatherDetailPopup: React.FC<WeatherDetailPopupProps> = ({
  hourData,
  isCelsius,
  onClose,
}) => {
  if (!hourData) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              color: "#2c3e50",
              fontSize: "1.8rem",
            }}
          >
            {formatTime(hourData.dt)}
          </h2>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#e74c3c",
              margin: "16px 0",
            }}
          >
            {Math.round(hourData.temp)}°{isCelsius ? "C" : "F"}
          </div>
          <div
            style={{
              fontSize: "1.2rem",
              color: "#7f8c8d",
              textTransform: "capitalize",
              marginBottom: "8px",
            }}
          >
            {hourData.weather.description}
          </div>
          <div
            style={{
              fontSize: "1rem",
              color: "#95a5a6",
            }}
          >
            Feels like {Math.round(hourData.feels_like)}°{isCelsius ? "C" : "F"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💧</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#3498db",
              }}
            >
              {hourData.humidity}%
            </div>
            <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>Humidity</div>
          </div>

          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💨</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#2ecc71",
              }}
            >
              {Math.round(hourData.wind.speed)} {isCelsius ? "m/s" : "mph"}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
              Wind Speed
            </div>
          </div>

          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌧️</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#9b59b6",
              }}
            >
              {Math.round(hourData.pop * 100)}%
            </div>
            <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
              Precipitation
            </div>
          </div>

          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌡️</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#e67e22",
              }}
            >
              {hourData.weather.main}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
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
  lon,
}) => {
  // Always call hooks first - before any conditional returns
  const [selectedHour, setSelectedHour] = useState<any>(null);

  // Prepare all hourly data for the grid with pagination support
  const allHourlyData = useMemo(() => {
    // Handle case where weatherData or hourly data doesn't exist
    if (!weatherData?.hourly || weatherData.hourly.length === 0) {
      return [];
    }

    const { hourly } = weatherData;
    // Sort by timestamp to ensure chronological order
    const sortedHourly = [...hourly].sort((a, b) => a.dt - b.dt);

    return sortedHourly.map((hour: any, index: number) => {
      const hourDate = new Date(hour.dt * 1000);
      const dateTimeString =
        hourDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }) +
        " " +
        hourDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

      return {
        id: index,
        time: formatTime(hour.dt),
        dateTime: dateTimeString,
        hour:
          new Date(hour.dt * 1000).getHours().toString().padStart(2, "0") +
          ":00",
        temperature: Math.round(hour.temp || 0),
        temperatureDisplay: `${Math.round(hour.temp || 0)}°${isCelsius ? "C" : "F"}`,
        feelsLike: Math.round(hour.feels_like || 0),
        feelsLikeDisplay: `${Math.round(hour.feels_like || 0)}°${isCelsius ? "C" : "F"}`,
        condition: hour.weather?.description || "N/A",
        conditionIcon: hour.weather?.icon || "",
        humidity: hour.humidity || 0,
        windSpeed: Math.round(hour.wind?.speed || 0),
        windDisplay: `${Math.round(hour.wind?.speed || 0)} ${isCelsius ? "m/s" : "mph"}`,
        precipitationChance: Math.round((hour.pop || 0) * 100),
        precipitationDisplay: `${Math.round((hour.pop || 0) * 100)}%`,
        rawData: hour,
      };
    });
  }, [weatherData?.hourly, isCelsius]);

  // Early returns after all hooks are called
  if (!weatherData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        No weather data available. Please select a location.
      </div>
    );
  }

  if (!weatherData.hourly || weatherData.hourly.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        No hourly weather data available.
      </div>
    );
  }

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(7);

  // Handle page change
  const handlePageChange = (event: any) => {
    setPage(event.page.skip / event.page.take);
    setPageSize(event.page.take);
  };

  // Data for current page
  const pagedData = useMemo(() => {
    const start = page * pageSize;
    return allHourlyData.slice(start, start + pageSize);
  }, [allHourlyData, page, pageSize]);

  const handleRowClick = (dataItem: HourlyWeatherRow) => {
    setSelectedHour(dataItem.rawData);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Make items per page dropdown bigger for double digit numbers */
        .k-pager-sizes .k-dropdownlist,
        .k-pager-sizes .k-picker,
        .k-pager-sizes .k-input-inner,
        .k-pager-sizes .k-dropdownlist .k-input {
          min-width: 64px !important;
          width: 80px !important;
          font-size: 1.1rem !important;
          height: 40px !important;
        }
        .k-pager-sizes .k-dropdownlist .k-input {
          padding-left: 12px !important;
        }
        .k-pager-sizes {
          font-size: 1.1rem !important;
        }
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
          background: #3b82f6;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
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
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
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

        .k-grid-header th,
        .k-grid-header .k-header {
          background: #34495e !important;
          font-weight: 700 !important;
          color: #fff !important;
          border-bottom: 2px solid #dee2e6 !important;
          padding: 16px 12px !important;
          font-size: 1rem !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
        }
        
        .k-grid-header {
          background: #34495e !important;
          border-top-left-radius: 12px !important;
          border-top-right-radius: 12px !important;
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
          padding: 12px 8px !important;
          vertical-align: middle !important;
          border-bottom: 1px solid #f1f3f4 !important;
          font-size: 0.9rem !important;
        }

        .k-grid thead th {
          padding: 10px 8px !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
        }

        .time-column {
          font-weight: 600 !important;
          color: #2c3e50 !important;
          font-size: 0.85rem !important;
        }

        .temp-column {
          font-weight: 600 !important;
          font-size: 1rem !important;
          color: #e74c3c !important;
          text-align: center !important;
        }

        .condition-column {
          text-transform: capitalize;
          color: #495057 !important;
          font-size: 0.85rem !important;
        }

        .humidity-column {
          color: #3498db !important;
          font-weight: 500 !important;
          text-align: center !important;
        }

        .wind-column {
          color: #2ecc71 !important;
          text-align: center !important;
          font-weight: 500 !important;
        }

        .precip-column {
          color: #9b59b6 !important;
          font-weight: 500 !important;
          text-align: center !important;
        }

        /* Improve grid overall readability */
        .k-grid .k-table {
          font-size: 0.9rem !important;
        }

        .k-grid .k-table tbody tr:hover {
          background-color: #f8f9fa !important;
          cursor: pointer !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .k-grid tbody td {
            padding: 8px 4px !important;
            font-size: 0.8rem !important;
          }
          
          .k-grid thead th {
            padding: 8px 4px !important;
            font-size: 0.75rem !important;
          }
        }
      `,
        }}
      />

      <div className="details-header">
        <h1 className="details-title">Hourly Weather Forecast</h1>
        <p className="details-subtitle">
          📍 {lat?.toFixed(4) || "0.0000"}°, {lon?.toFixed(4) || "0.0000"}°
        </p>
        <p className="details-subtitle">
          48-hour detailed weather outlook. Click any row for more details
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Grid
          data={pagedData}
          style={{
            height: "auto",
            maxHeight: "500px",
            background: "white",
            border: "none",
            width: "100%",
            minWidth: 0,
            maxWidth: "100%",
          }}
          rowHeight={55}
          onRowClick={(e) => handleRowClick(e.dataItem)}
          pageable={
            allHourlyData.length > 7
              ? {
                  buttonCount: 5,
                  info: true,
                  type: "numeric",
                  pageSizes: [7, 14, 21],
                  previousNext: true,
                }
              : false
          }
          pageSize={pageSize}
          skip={page * pageSize}
          total={allHourlyData.length}
          onPageChange={handlePageChange}
          resizable={false}
        >
          <GridColumn
            field="dateTime"
            title="Date & Time"
            className="time-column"
          />
          <GridColumn
            field="temperatureDisplay"
            title="Temp"
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
            title="Humidity"
            className="humidity-column"
          />
          <GridColumn
            field="windDisplay"
            title="Wind"
            className="wind-column"
          />
          <GridColumn
            field="precipitationDisplay"
            title="Rain"
            className="precip-column"
          />
        </Grid>
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
