// This is the old card
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  SunIcon,
  CloudIcon,
  CloudDrizzleIcon,
  SnowflakeIcon,
  DropletIcon,
  WindIcon,
  EyeIcon,
} from "lucide-react";
import { useState } from "react";
import { ForecastHour } from "../../api/openWeather";
import { formatDateTime, formatTime } from "../../utils/time";
import { formatTemperature } from "../../utils/convertTemp";

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

export function HourlyGrid({
  hourly,
  isCelsius,
  timezoneOffset,
}: HourlyGridProps) {
  const [selectedHour, setSelectedHour] = useState<GridData | null>(null);

  const tempUnit = isCelsius ? "C" : "F";

  // Sort hourly data by timestamp to ensure chronological order
  const sortedHourly = [...hourly].sort((a, b) => a.dt - b.dt);

  const gridData: GridData[] = sortedHourly.map((hour, index) => ({
    ...hour,
    id: index + 1,
    formattedTime: formatTime(hour.dt, timezoneOffset),
    formattedDateTime: formatDateTime(hour.dt, timezoneOffset),
    weatherMain: Array.isArray(hour.weather)
      ? hour.weather[0].main
      : hour.weather.main,
    weatherDescription: Array.isArray(hour.weather)
      ? hour.weather[0].description
      : hour.weather.description,
    temperatureFormatted: formatTemperature(hour.temp, tempUnit),
    feelsLikeFormatted: formatTemperature(hour.feels_like, tempUnit),
    precipitationPercent: Math.round(hour.pop * 100),
    visibility: (hour as any).visibility || 10000,
  }));

  // Background gradient mapping - made more subtle for background image compatibility
  const getBackground = (cond: string) => {
    if (cond.includes("rain"))
      return "linear-gradient(135deg, rgba(74, 144, 226, 0.95), rgba(0, 91, 234, 0.95))";
    if (cond.includes("cloud"))
      return "linear-gradient(135deg, rgba(189, 195, 199, 0.95), rgba(44, 62, 80, 0.95))";
    if (cond.includes("snow"))
      return "linear-gradient(135deg, rgba(131, 164, 212, 0.95), rgba(182, 251, 255, 0.95))";
    if (cond.includes("clear"))
      return "linear-gradient(135deg, rgba(247, 151, 30, 0.95), rgba(255, 210, 0, 0.95))";
    return "linear-gradient(135deg, rgba(41, 128, 185, 0.95), rgba(109, 213, 250, 0.95))";
  };

  const condition = selectedHour?.weather?.main?.toLowerCase() || "clear";
  const bg = getBackground(condition);

  const handleRowClick = (dataItem: GridData) => {
    setSelectedHour(dataItem);
  };

  const closeDialog = () => {
    setSelectedHour(null);
  };

  const getWeatherIcon = (condition: string, size = 20) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return <CloudDrizzleIcon size={size} />;
    if (cond.includes("cloud")) return <CloudIcon size={size} />;
    if (cond.includes("snow")) return <SnowflakeIcon size={size} />;
    if (cond.includes("clear")) return <SunIcon size={size} />;
    return <SunIcon size={size} />;
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
        <CardHeader
          style={{
            textAlign: "center",
            fontWeight: "600",
            background: "#3b82f6",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <CardTitle
            style={{
              color: "white",
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #fff, #e8f4f8)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Detailed Hourly Forecast
          </CardTitle>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              fontSize: "0.9rem",
              opacity: 0.8,
              color: "white",
            }}
          >
            48-hour detailed weather outlook with pagination • Click any row for
            more details
          </p>
        </CardHeader>

        <CardBody>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Grid
              data={gridData}
              style={{
                height: "600px",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "none",
              }}
              onRowClick={(event) => handleRowClick(event.dataItem)}
              pageable={{
                buttonCount: 5,
                info: true,
                type: "numeric",
                pageSizes: [12, 24, 48],
                previousNext: true,
              }}
              pageSize={12}
              total={gridData.length}
            >
              <GridColumn
                field="formattedDateTime"
                title="Date & Time"
                width="200px"
              />
              <GridColumn
                field="weatherDescription"
                title="Weather"
                width="180px"
              />
              <GridColumn
                field="temperatureFormatted"
                title="Temperature"
                width="130px"
              />
              <GridColumn
                field="feelsLikeFormatted"
                title="Feels Like"
                width="130px"
              />
              <GridColumn field="humidity" title="Humidity %" width="120px" />
              <GridColumn
                field="precipitationPercent"
                title="Rain %"
                width="100px"
              />
            </Grid>
          </div>
        </CardBody>
      </Card>

      {/* Enhanced Detail Dialog */}
      {selectedHour && (
        <>
          <style>{`
            .custom-dialog .k-dialog,
            .custom-dialog .k-dialog-content,
            .custom-dialog .k-dialog-wrapper,
            .custom-dialog .k-window,
            .custom-dialog .k-window-content {
              background-color: transparent !important;
              border-radius: 20px !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              overflow: hidden !important;
              box-shadow: none !important;
            }
          `}</style>
          <Dialog
            title=""
            onClose={closeDialog}
            width={700}
            height={"fit-content"}
            className="custom-dialog"
            style={{
              overflow: "hidden",
              padding: "0 !important",
              margin: "0 !important",
              border: "none !important",
              borderRadius: "20px !important",
              backgroundColor: "transparent !important",
              boxShadow: "none !important",
            }}
            contentStyle={{
              padding: "0 !important",
              margin: "0 !important",
              border: "none !important",
              backgroundColor: "transparent !important",
              borderRadius: "20px !important",
              overflow: "hidden !important",
              boxShadow: "none !important",
            }}
          >
            <Card
              style={{
                background: bg,
                color: "white",
                margin: 0,
                padding: 0,
                borderRadius: "20px",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                border: "none",
                boxShadow: "none",
              }}
            >
              <CardHeader
                style={{
                  padding: "2rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {getWeatherIcon(selectedHour.weatherMain, 64)}
                  <div>
                    <CardTitle
                      style={{
                        margin: 0,
                        fontSize: "1.8rem",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        color: "white",
                      }}
                    >
                      {selectedHour.weatherDescription}
                    </CardTitle>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        marginTop: "0.5rem",
                        opacity: 0.9,
                        color: "white",
                      }}
                    >
                      {selectedHour.formattedDateTime}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    justifyContent: "center",
                    padding: "1rem 0",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "3rem",
                        fontWeight: "200",
                        lineHeight: "1",
                        color: "white",
                      }}
                    >
                      {selectedHour.temperatureFormatted}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        opacity: 0.8,
                        marginTop: "0.5rem",
                        color: "white",
                      }}
                    >
                      Temperature
                    </div>
                  </div>
                  <div
                    style={{
                      width: "1px",
                      height: "60px",
                      background: "rgba(255,255,255,0.3)",
                      color: "white",
                    }}
                  ></div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "400",
                        color: "white",
                      }}
                    >
                      {selectedHour.feelsLikeFormatted}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        opacity: 0.8,
                        marginTop: "0.5rem",
                        color: "white",
                      }}
                    >
                      Feels Like
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardBody style={{ padding: "2rem", color: "white" }}>
                <h3
                  style={{
                    margin: "0 0 1.5rem 0",
                    fontSize: "1.2rem",
                    fontWeight: "500",
                    opacity: 0.9,
                    color: "white",
                  }}
                >
                  Detailed Conditions
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <DropletIcon
                      size={32}
                      style={{ marginBottom: "1rem", opacity: 0.8 }}
                    />
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {selectedHour.humidity}%
                    </div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Humidity
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <WindIcon
                      size={32}
                      style={{ marginBottom: "1rem", opacity: 0.8 }}
                    />
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {Math.round((selectedHour.wind?.speed || 0) * 3.6)} km/h
                    </div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Wind Speed
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <CloudDrizzleIcon
                      size={32}
                      style={{ marginBottom: "1rem", opacity: 0.8 }}
                    />
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {selectedHour.precipitationPercent}%
                    </div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Chance of Rain
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <EyeIcon
                      size={32}
                      style={{ marginBottom: "1rem", opacity: 0.8 }}
                    />
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {selectedHour.visibility
                        ? Math.round(selectedHour.visibility / 1000)
                        : 10}{" "}
                      km
                    </div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Visibility
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "2rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
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
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Close Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Dialog>
        </>
      )}
    </>
  );
}
