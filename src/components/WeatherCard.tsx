import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";
import {
  SunIcon,
  CloudIcon,
  CloudDrizzleIcon,
  SnowflakeIcon,
  WindIcon,
  DropletIcon,
  SunriseIcon,
  SunsetIcon,
  ThermometerSunIcon,
  ThermometerSnowflakeIcon,
  EyeIcon,
  GaugeIcon,
  MapPinIcon,
} from "lucide-react";
import { useState } from "react";

interface WeatherCardProps {
  loading: boolean;
  error: string | null;
  data: any;
  isCelsius?: boolean;
}

export function WeatherCard({ loading, error, data, isCelsius }: WeatherCardProps) {
  const [hovered, setHovered] = useState(false);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader type="infinite-spinner" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <Notification type={{ style: "error", icon: true }}>{error}</Notification>
      </div>
    );

  if (!data) return null;

  const condition = data.weather[0].main.toLowerCase();

  // Weather icon mapping
  const getWeatherIcon = (cond: string) => {
    if (cond.includes("rain")) return <CloudDrizzleIcon size={48} />;
    if (cond.includes("cloud")) return <CloudIcon size={48} />;
    if (cond.includes("snow")) return <SnowflakeIcon size={48} />;
    if (cond.includes("clear")) return <SunIcon size={48} />;
    return <SunIcon size={48} />;
  };

  // Background gradient mapping
  const getBackground = (cond: string) => {
    if (cond.includes("rain"))
      return "linear-gradient(135deg, #4a90e2, #005bea)";
    if (cond.includes("cloud"))
      return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    if (cond.includes("snow"))
      return "linear-gradient(135deg, #83a4d4, #b6fbff)";
    if (cond.includes("clear"))
      return "linear-gradient(135deg, #f7971e, #ffd200)";
    return "linear-gradient(135deg, #2980b9, #6dd5fa)";
  };

  const bg = getBackground(condition);
  const icon = getWeatherIcon(condition);

  // Function to darken the background by two shades
  const getDarkerBackground = (cond: string) => {
    if (cond.includes("rain"))
      return "linear-gradient(135deg, #2c5aa0, #003388)";
    if (cond.includes("cloud"))
      return "linear-gradient(135deg, #7f8c8d, #1a252f)";
    if (cond.includes("snow"))
      return "linear-gradient(135deg, #5a7fa7, #7dd3ff)";
    if (cond.includes("clear"))
      return "linear-gradient(135deg, #cc5500, #e6ac00)";
    return "linear-gradient(135deg, #1e5f8c, #4a9bc1)";
  };

  const darkerBg = getDarkerBackground(condition);

  return (
    <div
      style={{ position: "relative", width: 360, margin: "0 auto" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main Weather Card */}
      <Card
        style={{
          borderRadius: "20px",
          color: "white",
          background: bg,
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          overflow: "hidden",
          border: "none",
          outline: "none",
          transform: hovered ? "translateX(-50%)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 2,
          backgroundClip: "padding-box",
        }}
      >
        <CardHeader style={{ 
          textAlign: "center", 
          fontWeight: "600", 
          padding: "1.5rem 2rem 1rem", 
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <MapPinIcon size={16} />
            {data.name}, {data.sys.country}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.25rem" }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </CardHeader>
        <CardBody style={{ padding: "2rem" }}>
          {/* Main temperature display */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1rem" }}>{icon}</div>
            <CardTitle style={{ 
              fontSize: "4rem", 
              margin: "0", 
              fontWeight: "200", 
              lineHeight: "1",
              letterSpacing: "-2px"
            }}>
              {Math.round(data.main.temp)}{isCelsius ? "°C" : "°F"}
            </CardTitle>
            <p style={{ 
              textTransform: "capitalize", 
              fontSize: "1.2rem", 
              margin: "0.5rem 0 0",
              opacity: 0.9,
              fontWeight: "400"
            }}>
              {data.weather[0].description}
            </p>
          </div>
          
          {/* Secondary metrics in clean grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "1.5rem",
            fontSize: "0.95rem",
            opacity: 0.9,
            padding: "1rem 0",
            borderTop: "1px solid rgba(255,255,255,0.15)"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "0.5rem",
              textAlign: "center"
            }}>
              <ThermometerSunIcon size={18} />
              <div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Feels like</div>
                <div style={{ fontWeight: "600" }}>{Math.round(data.main.feels_like)}{isCelsius ? "°C" : "°F"}</div>
              </div>
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "0.5rem",
              textAlign: "center"
            }}>
              <EyeIcon size={18} />
              <div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Visibility</div>
                <div style={{ fontWeight: "600" }}>{data.visibility ? Math.round(data.visibility / 1000) : 10}km</div>
              </div>
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "0.5rem",
              textAlign: "center"
            }}>
              <GaugeIcon size={18} />
              <div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Pressure</div>
                <div style={{ fontWeight: "600" }}>{data.main.pressure}hPa</div>
              </div>
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "0.5rem",
              textAlign: "center"
            }}>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sliding Extra Info Card - Clean organized layout */}
      <Card
        style={{
          position: "absolute",
          top: 0,
          left: 18,
          height: "100%",
          width: "80%",
          borderRadius: "0 20px 20px 0",
          color: "white",
          background: darkerBg,
          padding: "2rem",
          boxShadow: hovered ? "0 10px 20px rgba(0,0,0,0.2)" : "none",
          transform: hovered ? "translateX(50%)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 1,
          border: "none",
          outline: "none",
          backgroundClip: "padding-box",
        }}
      >
        {/* Weather Details Header */}
        <div style={{ 
          fontSize: "1.1rem", 
          fontWeight: "600", 
          marginBottom: "1.5rem",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          paddingBottom: "0.75rem"
        }}>
          Weather Details
        </div>

        {/* Organized metrics in sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Atmospheric Section */}
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.75rem", fontWeight: "500" }}>
              Atmospheric
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  <DropletIcon size={14} />
                  Humidity
                </div>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>{data.main.humidity}%</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  <WindIcon size={14} />
                  Wind
                </div>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>{Math.round(data.wind.speed * 3.6)} km/h</div>
              </div>
            </div>
          </div>

          {/* Temperature Section */}
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.75rem", fontWeight: "500" }}>
              Temperature Range
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  <ThermometerSunIcon size={14} />
                  High
                </div>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>{Math.round(data.main.temp_max)}{isCelsius ? "°C" : "°F"}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  <ThermometerSnowflakeIcon size={14} />
                  Low
                </div>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>{Math.round(data.main.temp_min)}{isCelsius ? "°C" : "°F"}</div>
              </div>
            </div>
          </div>

          {/* Sun Times Section */}
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.75rem", fontWeight: "500" }}>
              Sun Times
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  <SunriseIcon size={14} />
                  Sunrise
                </div>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                  {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  <SunsetIcon size={14} />
                  Sunset
                </div>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                  {new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}