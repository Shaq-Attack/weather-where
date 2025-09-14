import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import { 
  SunIcon, 
  CloudIcon, 
  CloudDrizzleIcon, 
  SnowflakeIcon,
  DropletIcon,
  WindIcon,
  EyeIcon
} from "lucide-react";
import { useState } from "react";
import { ForecastHour } from "../api/openWeather";
import { formatDateTime, formatTime } from "../utils/time";
import { formatTemperature } from "../utils/convertTemp";
import { YAxis } from "recharts";

interface HourlyGridProps {
  hourly: ForecastHour[];
  isCelsius: boolean;
  timezoneOffset?: number;
}

interface GridData extends ForecastHour {
  id: number;
  formattedTime: string;
  formattedDateTime: string;
  weatherMain: string;
  weatherDescription: string;
  temperatureFormatted: string;
  feelsLikeFormatted: string;
  precipitationPercent: number;
  visibility?: number;
}

export function HourlyGrid({ hourly, isCelsius, timezoneOffset }: HourlyGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHour, setSelectedHour] = useState<GridData | null>(null);
  const itemsPerPage = 20;

  const tempUnit = isCelsius ? 'C' : 'F';

  const gridData: GridData[] = hourly.map((hour, index) => ({
    ...hour,
    id: index + 1,
    formattedTime: formatTime(hour.dt, timezoneOffset),
    formattedDateTime: formatDateTime(hour.dt, timezoneOffset),
    weatherMain: hour.weather[0].main,
    weatherDescription: hour.weather[0].description,
    temperatureFormatted: formatTemperature(hour.temp, tempUnit),
    feelsLikeFormatted: formatTemperature(hour.feels_like, tempUnit),
    precipitationPercent: Math.round(hour.pop * 100),
    visibility: (hour as any).visibility || 10000
  }));

  // Apply pagination (no sorting for simplicity)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedData = gridData.slice(startIndex, startIndex + itemsPerPage);

  // Weather icon mapping
  const getWeatherIcon = (condition: string, size = 20) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return <CloudDrizzleIcon size={size} />;
    if (cond.includes("cloud")) return <CloudIcon size={size} />;
    if (cond.includes("snow")) return <SnowflakeIcon size={size} />;
    if (cond.includes("clear")) return <SunIcon size={size} />;
    return <SunIcon size={size} />;
  };

  const handleRowClick = (dataItem: GridData) => {
    setSelectedHour(dataItem);
  };

  const closeDialog = () => {
    setSelectedHour(null);
  };

  return (
    <>
      <Card 
        style={{ 
          borderRadius: "20px", 
          margin: "1rem auto", 
          maxWidth: "1200px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          color: "white",
          border: "none",
          width: "fit-content",
        }}
      >
        <CardHeader style={{ 
          textAlign: "center", 
          fontWeight: "600", 
          background: "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <CardTitle style={{ 
            color: "white", 
            fontSize: "1.5rem",
            margin: 0,
            background: "linear-gradient(45deg, #fff, #e8f4f8)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Detailed Hourly Forecast
          </CardTitle>
          <p style={{ 
            margin: "0.5rem 0 0 0", 
            fontSize: "0.9rem", 
            opacity: 0.8,
            color: "white"
          }}>
            48-hour detailed weather outlook • Click any row for more details
          </p>
        </CardHeader>
        
        <CardBody style={{ padding: "2rem" }}>
          <div style={{ 
            marginBottom: "1.5rem", 
            color: "rgba(255,255,255,0.8)", 
            fontSize: "0.9rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>Showing {pagedData.length} of {gridData.length} entries</span>
            <span>Page {currentPage} of {Math.ceil(gridData.length / itemsPerPage)}</span>
          </div>
          
          <div style={{ 
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "1rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <div style={{ 
              maxHeight: "600px", 
              overflowY: "auto", 
              borderRadius: "12px",
              background: "rgba(255,255,255,0.95)"
            }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                fontSize: "0.9rem"
              }}>
                <thead style={{ 
                  background: "linear-gradient(135deg, #34495e, #2c3e50)",
                  position: "sticky", 
                  top: 0,
                  zIndex: 1
                }}>
                  <tr>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "left", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Date & Time
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Weather
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Temperature
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Feels Like
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Humidity
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Wind
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Rain
                    </th>
                    <th style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center", 
                      fontWeight: "600",
                      color: "white",
                      borderBottom: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                {pagedData.map((hour, index) => (
                  <tr 
                    key={hour.dt}
                    style={{ 
                      borderBottom: "1px solid #e9ecef",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: index % 2 === 0 ? "rgba(248,249,250,0.3)" : "transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(102, 126, 234, 0.1)";
                      e.currentTarget.style.transform = "scale(1.01)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? "rgba(248,249,250,0.3)" : "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    onClick={() => handleRowClick(hour)}
                  >
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "left",
                      color: "#2c3e50",
                      fontWeight: "500"
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                          {hour.formattedTime}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                          {new Date(hour.dt * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center",
                      color: "#2c3e50"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        gap: "0.5rem" 
                      }}>
                        {getWeatherIcon(hour.weatherMain, 24)}
                        <span style={{ 
                          fontSize: "0.8rem", 
                          color: "#6c757d",
                          textTransform: "capitalize",
                          textAlign: "center"
                        }}>
                          {hour.weatherDescription}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center",
                      color: "#2c3e50",
                      fontWeight: "600",
                      fontSize: "1rem"
                    }}>
                      {hour.temperatureFormatted}
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center",
                      color: "#6c757d",
                      fontWeight: "500"
                    }}>
                      {hour.feelsLikeFormatted}
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center",
                      color: "#2c3e50"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: "0.5rem" 
                      }}>
                        <DropletIcon size={16} color="#3498db" />
                        <span style={{ fontWeight: "500" }}>{hour.humidity}%</span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center",
                      color: "#2c3e50"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: "0.5rem" 
                      }}>
                        <WindIcon size={16} color="#95a5a6" />
                        <span style={{ fontWeight: "500" }}>{Math.round((hour.wind?.speed || 0) * 3.6)} km/h</span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center",
                      color: "#2c3e50"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: "0.5rem" 
                      }}>
                        <span style={{ 
                          fontWeight: "500",
                          color: hour.precipitationPercent > 50 ? "#e74c3c" : "#27ae60"
                        }}>
                          {hour.precipitationPercent}%
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: "1rem 0.75rem", 
                      textAlign: "center"
                    }}>
                      <Button 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(hour);
                        }}
                        style={{
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                          padding: "0.5rem 1rem",
                          fontSize: "0.8rem",
                          fontWeight: "500"
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Simple Pagination */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginTop: "1rem",
            padding: "1rem 0"
          }}>
            <div style={{ color: "#666", fontSize: "0.9rem" }}>
              Page {currentPage} of {Math.ceil(gridData.length / itemsPerPage)}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ padding: "0.5rem 1rem" }}
              >
                Previous
              </Button>
              <Button
                disabled={currentPage === Math.ceil(gridData.length / itemsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{ padding: "0.5rem 1rem" }}
              >
                Next
              </Button>
            </div>
          </div>
          </div>
        </CardBody>
      </Card>

      {/* Enhanced Detail Dialog */}
      {selectedHour && (
        <Dialog
          title=""
          onClose={closeDialog}
          width={700}
          height={600}
          style={{
            borderRadius: "20px",
            overflow: "hidden"
          }}
        >
          <div style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "0"
          }}>
            {/* Header */}
            <div style={{
              padding: "2rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1.5rem", 
                marginBottom: "1rem"
              }}>
                {getWeatherIcon(selectedHour.weatherMain, 64)}
                <div>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: "1.8rem", 
                    fontWeight: "600",
                    textTransform: "capitalize"
                  }}>
                    {selectedHour.weatherDescription}
                  </h2>
                  <div style={{ 
                    fontSize: "1.2rem", 
                    marginTop: "0.5rem", 
                    opacity: 0.9 
                  }}>
                    {selectedHour.formattedDateTime}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2rem",
                justifyContent: "center",
                padding: "1rem 0"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", fontWeight: "200", lineHeight: "1" }}>
                    {selectedHour.temperatureFormatted}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "0.5rem" }}>
                    Current Temperature
                  </div>
                </div>
                <div style={{ 
                  width: "1px", 
                  height: "60px", 
                  background: "rgba(255,255,255,0.3)" 
                }}></div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "400" }}>
                    {selectedHour.feelsLikeFormatted}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "0.5rem" }}>
                    Feels Like
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ padding: "2rem" }}>
              <h3 style={{ 
                margin: "0 0 1.5rem 0", 
                fontSize: "1.2rem", 
                fontWeight: "500",
                opacity: 0.9
              }}>
                Detailed Conditions
              </h3>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "1.5rem"
              }}>
                <div style={{ 
                  background: "rgba(255,255,255,0.1)",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textAlign: "center"
                }}>
                  <DropletIcon size={32} style={{ marginBottom: "1rem", opacity: 0.8 }} />
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {selectedHour.humidity}%
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Humidity
                  </div>
                </div>
                
                <div style={{ 
                  background: "rgba(255,255,255,0.1)",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textAlign: "center"
                }}>
                  <WindIcon size={32} style={{ marginBottom: "1rem", opacity: 0.8 }} />
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {Math.round((selectedHour.wind?.speed || 0) * 3.6)} km/h
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Wind Speed
                  </div>
                </div>
                
                <div style={{ 
                  background: "rgba(255,255,255,0.1)",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textAlign: "center"
                }}>
                  <CloudDrizzleIcon size={32} style={{ marginBottom: "1rem", opacity: 0.8 }} />
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {selectedHour.precipitationPercent}%
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Chance of Rain
                  </div>
                </div>
                
                <div style={{ 
                  background: "rgba(255,255,255,0.1)",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textAlign: "center"
                }}>
                  <EyeIcon size={32} style={{ marginBottom: "1rem", opacity: 0.8 }} />
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {selectedHour.visibility ? Math.round(selectedHour.visibility / 1000) : 10} km
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Visibility
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div style={{ 
                textAlign: "center", 
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.1)"
              }}>
                <Button 
                  onClick={closeDialog}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                    color: "white",
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
