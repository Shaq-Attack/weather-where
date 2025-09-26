//This is the old card
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import {
  SunIcon,
  CloudIcon,
  CloudDrizzleIcon,
  SnowflakeIcon,
  ThermometerSunIcon,
  DropletIcon,
  WindIcon,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ForecastDay, ForecastHour } from "../../api/openWeather";
import { formatDate, formatTime } from "../../utils/time";
import { formatTemperature } from "../../utils/convertTemp";

interface ForecastCardProps {
  daily: ForecastDay[];
  hourly: ForecastHour[];
  isCelsius: boolean;
  timezoneOffset?: number;
}

export function ForecastCard({
  daily,
  hourly,
  isCelsius,
  timezoneOffset,
}: ForecastCardProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);

  // Weather icon mapping
  const getWeatherIcon = (condition: string, size = 24) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return <CloudDrizzleIcon size={size} />;
    if (cond.includes("cloud")) return <CloudIcon size={size} />;
    if (cond.includes("snow")) return <SnowflakeIcon size={size} />;
    if (cond.includes("clear")) return <SunIcon size={size} />;
    return <SunIcon size={size} />;
  };

  const handleDayClick = (day: ForecastDay) => {
    setSelectedDay(day);
  };

  const closeDialog = () => {
    setSelectedDay(null);
  };

  // Get hourly data for selected day
  const getHourlyForDay = (day: ForecastDay): ForecastHour[] => {
    const dayStart = new Date(day.dt * 1000);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    return hourly.filter((hour) => {
      const hourDate = new Date(hour.dt * 1000);
      return hourDate >= dayStart && hourDate <= dayEnd;
    });
  };

  // Prepare chart data for hourly temperature trend
  const chartData = hourly.slice(0, 24).map((hour) => ({
    time: formatTime(hour.dt, timezoneOffset),
    temperature: Math.round(hour.temp),
    feelsLike: Math.round(hour.feels_like),
  }));

  const tempUnit = isCelsius ? "C" : "F";

  return (
    <Card
      style={{
        borderRadius: "20px",
        margin: "1rem auto",
        maxWidth: "1500px",
        width: "fit-content",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <CardHeader
        style={{
          textAlign: "center",
          fontWeight: "bold",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)",
        }}
      >
        <CardTitle
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardBody style={{ padding: "1.5rem" }}>
        <TabStrip
          selected={selectedTab}
          onSelect={(e) => setSelectedTab(e.selected)}
        >
          <TabStripTab
            title="Daily Forecast"
            aria-label="Daily weather forecast"
          >
            <div style={{ padding: "1rem 0" }}>
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "1rem",
                  paddingBottom: "1rem",
                }}
                role="list"
                aria-label="7-day weather forecast"
              >
                {daily.slice(0, 7).map((day, index) => (
                  <Card
                    key={day.dt}
                    style={{
                      minWidth: "140px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      border: "1px solid #e0e0e0",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                    onClick={() => handleDayClick(day)}
                    role="listitem"
                    tabIndex={0}
                    aria-label={`Weather for ${formatDate(day.dt)}: ${day.weather[0].description}, High ${formatTemperature(day.temp.max, tempUnit)}, Low ${formatTemperature(day.temp.min, tempUnit)}`}
                    onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDayClick(day);
                      }
                    }}
                  >
                    <CardBody style={{ padding: "1rem" }}>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {index === 0 ? "Today" : formatDate(day.dt)}
                      </div>
                      <div style={{ margin: "0.5rem 0" }}>
                        {getWeatherIcon(day.weather[0].main, 32)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {day.weather[0].description}
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        <span style={{ color: "#e74c3c" }}>
                          {formatTemperature(day.temp.max, tempUnit)}
                        </span>
                        {" / "}
                        <span style={{ color: "#3498db" }}>
                          {formatTemperature(day.temp.min, tempUnit)}
                        </span>
                      </div>
                      {day.pop > 0 && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#3498db",
                            marginTop: "0.25rem",
                          }}
                        >
                          <DropletIcon
                            size={12}
                            style={{ verticalAlign: "middle" }}
                          />{" "}
                          {Math.round(day.pop * 100)}%
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </TabStripTab>

          <TabStripTab
            title="Hourly Forecast"
            aria-label="Hourly weather forecast"
          >
            <div style={{ padding: "1rem 0" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ margin: "0 0 1rem 0" }}>
                  24-Hour Temperature Trend
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value}°${tempUnit}`,
                        name === "temperature" ? "Temperature" : "Feels Like",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#3498db"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="feelsLike"
                      stroke="#e74c3c"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    gap: "2rem",
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "3px",
                        backgroundColor: "#3498db",
                        borderRadius: "2px",
                      }}
                    ></div>
                    <span>Temperature</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "2px",
                        backgroundColor: "#e74c3c",
                        borderRadius: "1px",
                        backgroundImage:
                          "repeating-linear-gradient(90deg, #e74c3c 0px, #e74c3c 5px, transparent 5px, transparent 10px)",
                      }}
                    ></div>
                    <span>Feels Like</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "0.75rem",
                  paddingBottom: "1rem",
                }}
                role="list"
                aria-label="Detailed Hourly Forecast"
              >
                {hourly.slice(0, 24).map((hour) => (
                  <Card
                    key={hour.dt}
                    style={{
                      minWidth: "100px",
                      textAlign: "center",
                      border: "1px solid #e0e0e0",
                    }}
                    role="listitem"
                    aria-label={`Weather at ${formatTime(hour.dt, timezoneOffset)}: ${hour.weather.description}, ${formatTemperature(hour.temp, tempUnit)}`}
                  >
                    <CardBody style={{ padding: "0.75rem" }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {formatTime(hour.dt, timezoneOffset)}
                      </div>
                      <div style={{ margin: "0.5rem 0" }}>
                        {getWeatherIcon(hour.weather.main, 24)}
                      </div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        {formatTemperature(hour.temp, tempUnit)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#666",
                          marginTop: "0.25rem",
                        }}
                      >
                        <DropletIcon
                          size={10}
                          style={{ verticalAlign: "middle" }}
                        />{" "}
                        {Math.round(hour.pop * 100)}%
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </TabStripTab>
        </TabStrip>
      </CardBody>

      {/* Day Detail Dialog */}
      {selectedDay && (
        <Dialog
          title={`Weather Details - ${formatDate(selectedDay.dt)}`}
          onClose={closeDialog}
          width={600}
          height={500}
        >
          <div style={{ padding: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {getWeatherIcon(selectedDay.weather[0].main, 48)}
              <div>
                <h3 style={{ margin: 0 }}>
                  {selectedDay.weather[0].description}
                </h3>
                <div style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                  <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                    {formatTemperature(selectedDay.temp.max, tempUnit)}
                  </span>
                  {" / "}
                  <span style={{ color: "#3498db", fontWeight: "bold" }}>
                    {formatTemperature(selectedDay.temp.min, tempUnit)}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <DropletIcon size={18} />
                <span>Humidity: {selectedDay.humidity}%</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <WindIcon size={18} />
                <span>Wind: {selectedDay.wind.speed} m/s</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <ThermometerSunIcon size={18} />
                <span>
                  Day Temp: {formatTemperature(selectedDay.temp.day, tempUnit)}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <DropletIcon size={18} />
                <span>Rain Chance: {Math.round(selectedDay.pop * 100)}%</span>
              </div>
            </div>

            <h4>Hourly Breakdown</h4>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#f5f5f5" }}>
                  <tr>
                    <th
                      style={{
                        padding: "0.5rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Time
                    </th>
                    <th
                      style={{
                        padding: "0.5rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Temp
                    </th>
                    <th
                      style={{
                        padding: "0.5rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Condition
                    </th>
                    <th
                      style={{
                        padding: "0.5rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Rain %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getHourlyForDay(selectedDay).map((hour, index) => (
                    <tr
                      key={hour.dt}
                      style={{
                        borderBottom:
                          index < getHourlyForDay(selectedDay).length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                      }}
                    >
                      <td style={{ padding: "0.5rem" }}>
                        {formatTime(hour.dt, timezoneOffset)}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        {formatTemperature(hour.temp, tempUnit)}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          {getWeatherIcon(hour.weather.main, 16)}
                          <span style={{ fontSize: "0.8rem" }}>
                            {hour.weather.main}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        {Math.round(hour.pop * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Button themeColor="primary" onClick={closeDialog}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
