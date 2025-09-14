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
          backgroundClip: "padding-box",
        }}
      >
        <CardHeader style={{ textAlign: "center", fontWeight: "bold", padding: "2rem", color: "white" }}>
          {data.name}
        </CardHeader>
        <CardBody style={{ textAlign: "center", padding: "2rem" }}>
          <div>{icon}</div>
          <CardTitle style={{ fontSize: "3rem", margin: "0.5rem 0" }}>
            {Math.round(data.main.temp)}{isCelsius ? "°C" : "°F"}
          </CardTitle>
          <p style={{ textTransform: "capitalize" }}>
            {data.weather[0].description}
          </p>
        </CardBody>
      </Card>

      {/* Sliding Extra Info Card */}
    <Card
      style={{
        position: "absolute",
        top: "calc(100% - 20px)",
        left: 0,
        width: "100%",
        borderRadius: "0 0 20px 20px",
        color: "white",
        background: darkerBg,
        padding: "2rem",
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        transform: hovered ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease",
        zIndex: -1,
        border: "none",
        outline: "none",
        backgroundClip: "padding-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <DropletIcon size={18} /> {data.main.humidity}%
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <WindIcon size={18} /> {data.wind.speed} m/s
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ThermometerSunIcon size ={18} /> {data.main.temp_max}{isCelsius ? "°C" : "°F"}
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ThermometerSnowflakeIcon size ={18} /> {data.main.temp_min}{isCelsius ? "°C" : "°F"}
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
      <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <SunriseIcon size={18} />{" "}
        {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
      </p>
      <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <SunsetIcon size={18} />{" "}
        {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
      </p>
      </div>
    </Card>
    </div>
  );
}