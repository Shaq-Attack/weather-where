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
  DropletIcon,
  SunriseIcon,
  SunsetIcon,
  ThermometerSunIcon,
  ThermometerSnowflakeIcon,
  EyeIcon,
  GaugeIcon,
  MapPinIcon,
} from "lucide-react";
import {
  normalizeWeatherCondition,
  getWeatherBorderColor,
} from "../../utils/weather";
import {
  LoadingCard,
  ErrorNotification,
  formatCurrentDate,
  formatUnixTime,
} from "../../utils/components";
import { GlobalAnimationStyles } from "../../utils/styleComponents";

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

  const borderColor = getWeatherBorderColor(condition);
  const icon = getWeatherIcon(condition);

  return (
    <>
      <GlobalAnimationStyles />
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: "8px",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            borderTop: `4px solid ${borderColor}`,
          }}
        >
          <CardHeader
            style={{
              padding: "1.25rem 1.5rem 1rem",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              <MapPinIcon size={14} />
              {data.name}, {data.sys.country}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.2rem",
              }}
            >
              {formatCurrentDate()}
            </div>
          </CardHeader>
          <CardBody style={{ padding: "1.5rem" }}>
            {/* Main temperature display */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "0.75rem", color: "#475569" }}>
                {icon}
              </div>
              <CardTitle
                style={{
                  fontSize: "4rem",
                  margin: "0",
                  fontWeight: "300",
                  lineHeight: "1",
                  letterSpacing: "-1px",
                  color: "#0f172a",
                }}
              >
                {Math.round(data.main.temp)}
                {isCelsius ? "°C" : "°F"}
              </CardTitle>
              <p
                style={{
                  textTransform: "capitalize",
                  fontSize: "1rem",
                  margin: "0.5rem 0 0",
                  color: "#64748b",
                  fontWeight: "400",
                }}
              >
                {data.weather[0].description}
              </p>
            </div>

            {/* Secondary metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: "#e2e8f0",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              {[
                {
                  icon: <ThermometerSunIcon size={14} />,
                  label: "Feels like",
                  value: `${Math.round(data.main.feels_like)}${isCelsius ? "°C" : "°F"}`,
                },
                {
                  icon: <EyeIcon size={14} />,
                  label: "Visibility",
                  value: `${data.visibility ? Math.round(data.visibility / 1000) : 10} km`,
                },
                {
                  icon: <GaugeIcon size={14} />,
                  label: "Pressure",
                  value: `${data.main.pressure} hPa`,
                },
                {
                  icon: <DropletIcon size={14} />,
                  label: "Humidity",
                  value: `${data.main.humidity}%`,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{ background: "white", padding: "12px 14px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#94a3b8",
                      fontSize: "0.75rem",
                      marginBottom: "4px",
                    }}
                  >
                    {m.icon} {m.label}
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#0f172a",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Sun times */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {[
                {
                  icon: <SunriseIcon size={14} />,
                  label: "Sunrise",
                  value: formatUnixTime(data.sys.sunrise),
                },
                {
                  icon: <SunsetIcon size={14} />,
                  label: "Sunset",
                  value: formatUnixTime(data.sys.sunset),
                },
                {
                  icon: <ThermometerSunIcon size={14} />,
                  label: "High",
                  value: `${Math.round(data.main.temp_max)}${isCelsius ? "°C" : "°F"}`,
                },
                {
                  icon: <ThermometerSnowflakeIcon size={14} />,
                  label: "Low",
                  value: `${Math.round(data.main.temp_min)}${isCelsius ? "°C" : "°F"}`,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div style={{ color: "#94a3b8" }}>{m.icon}</div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        color: "#0f172a",
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
