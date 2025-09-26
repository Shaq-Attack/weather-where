import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
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
import {
  normalizeWeatherCondition,
  getWeatherBackground,
} from "../../utils/weather";
import {
  LoadingCard,
  ErrorNotification,
  formatCurrentDate,
  formatUnixTime,
} from "../../utils/components";
import { MetricItem, GlobalAnimationStyles } from "../../utils/styleComponents";

interface WeatherCardProps {
  loading: boolean;
  error: string | null;
  data: any;
  isCelsius?: boolean;
}

export function WeatherCard({
  loading,
  error,
  data,
  isCelsius,
}: WeatherCardProps) {
  const [hovered, setHovered] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <LoadingCard message="Loading weather data..." />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ErrorNotification message={error} type="error" />
      </>
    );
  }

  if (!data) return null;

  const condition = data.weather[0].main.toLowerCase();

  // Weather icon mapping using clean function
  const getWeatherIcon = (cond: string) => {
    const normalized = normalizeWeatherCondition(cond);
    const iconMap = {
      rain: <CloudDrizzleIcon size={48} />,
      drizzle: <CloudDrizzleIcon size={48} />,
      thunderstorm: <CloudDrizzleIcon size={48} />,
      cloud: <CloudIcon size={48} />,
      snow: <SnowflakeIcon size={48} />,
      clear: <SunIcon size={48} />,
      mist: <CloudIcon size={48} />,
      fog: <CloudIcon size={48} />,
      haze: <CloudIcon size={48} />,
    };
    return iconMap[normalized as keyof typeof iconMap] || <SunIcon size={48} />;
  };

  const bg = getWeatherBackground(condition);
  const darkerBg = getWeatherBackground(condition, true);
  const icon = getWeatherIcon(condition);

  return (
    <>
      <GlobalAnimationStyles />
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
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            overflow: "hidden",
            border: "none",
            outline: "none",
            transform: hovered ? "translateX(-50%)" : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 2,
            backgroundClip: "padding-box",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardHeader
            style={{
              textAlign: "center",
              fontWeight: "600",
              padding: "1.5rem 2rem 1rem",
              color: "white",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <MapPinIcon size={16} />
              {data.name}, {data.sys.country}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                opacity: 0.8,
                marginTop: "0.25rem",
              }}
            >
              {formatCurrentDate()}
            </div>
          </CardHeader>
          <CardBody style={{ padding: "2rem" }}>
            {/* Main temperature display */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ marginBottom: "1rem" }}>{icon}</div>
              <CardTitle
                style={{
                  fontSize: "4rem",
                  margin: "0",
                  fontWeight: "200",
                  lineHeight: "1",
                  letterSpacing: "-2px",
                }}
              >
                {Math.round(data.main.temp)}
                {isCelsius ? "°C" : "°F"}
              </CardTitle>
              <p
                style={{
                  textTransform: "capitalize",
                  fontSize: "1.2rem",
                  margin: "0.5rem 0 0",
                  opacity: 0.9,
                  fontWeight: "400",
                }}
              >
                {data.weather[0].description}
              </p>
            </div>

            {/* Secondary metrics in clean grid */}
            <div className="metric-grid">
              <MetricItem
                icon={<ThermometerSunIcon size={18} />}
                label="Feels like"
                value={`${Math.round(data.main.feels_like)}${isCelsius ? "°C" : "°F"}`}
              />
              <MetricItem
                icon={<EyeIcon size={18} />}
                label="Visibility"
                value={`${data.visibility ? Math.round(data.visibility / 1000) : 10}km`}
              />
              <MetricItem
                icon={<GaugeIcon size={18} />}
                label="Pressure"
                value={`${data.main.pressure}hPa`}
              />
              <MetricItem
                icon={<DropletIcon size={18} />}
                label="Humidity"
                value={`${data.main.humidity}%`}
              />
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
            boxShadow: hovered ? "0 10px 20px rgba(0,0,0,0.3)" : "none",
            transform: hovered ? "translateX(50%)" : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
            border: "none",
            outline: "none",
            backgroundClip: "padding-box",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Weather Details Header */}
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              paddingBottom: "0.75rem",
            }}
          >
            Weather Details
          </div>

          {/* Organized metrics in sections */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Atmospheric Section */}
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  marginBottom: "0.75rem",
                  fontWeight: "500",
                }}
              >
                Atmospheric
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      opacity: 0.8,
                    }}
                  >
                    <DropletIcon size={14} />
                    Humidity
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {data.main.humidity}%
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      opacity: 0.8,
                    }}
                  >
                    <WindIcon size={14} />
                    Wind
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {Math.round(data.wind.speed * 3.6)} km/h
                  </div>
                </div>
              </div>
            </div>

            {/* Temperature Section */}
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  marginBottom: "0.75rem",
                  fontWeight: "500",
                }}
              >
                Temperature Range
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      opacity: 0.8,
                    }}
                  >
                    <ThermometerSunIcon size={14} />
                    High
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {Math.round(data.main.temp_max)}
                    {isCelsius ? "°C" : "°F"}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      opacity: 0.8,
                    }}
                  >
                    <ThermometerSnowflakeIcon size={14} />
                    Low
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {Math.round(data.main.temp_min)}
                    {isCelsius ? "°C" : "°F"}
                  </div>
                </div>
              </div>
            </div>

            {/* Sun Times Section */}
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  marginBottom: "0.75rem",
                  fontWeight: "500",
                }}
              >
                Sun Times
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      opacity: 0.8,
                    }}
                  >
                    <SunriseIcon size={14} />
                    Sunrise
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {formatUnixTime(data.sys.sunrise)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      opacity: 0.8,
                    }}
                  >
                    <SunsetIcon size={14} />
                    Sunset
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {formatUnixTime(data.sys.sunset)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
