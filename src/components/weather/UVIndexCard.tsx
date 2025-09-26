import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "@progress/kendo-react-layout";
import {
  getCurrentUVIndex,
  fetchUVIndex,
  fetchWeather,
} from "../../api/openWeather";
import { getUVIndexInfo, getUVProtectionAdvice } from "../../utils/weather";
import { cardStyles, headerStyles, bodyStyles } from "../../utils/styles";
import {
  LoadingCard,
  ErrorCard,
  ErrorNotification,
  useLoadingWithFade,
  formatUnixTime,
  createCancelToken,
  isCancelled,
  cancelToken,
} from "../../utils/components";
import {
  GlobalAnimationStyles,
  SunTime,
  CircularIndicator,
  ProtectionTip,
  InfoBadge,
} from "../../utils/styleComponents";

interface UVData {
  uvIndex: number;
  riskLevel: string;
  color: string;
  sunrise: string;
  sunset: string;
  peakUVTime: string;
  recommendation: string;
  spfRecommendation: string;
}

interface UVIndexCardProps {
  lat?: number;
  lon?: number;
}

export function UVIndexCard({ lat, lon }: UVIndexCardProps) {
  const [uvData, setUvData] = useState<UVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { loading, fadeClass, startLoading, finishLoading } =
    useLoadingWithFade();
  const cancelTokenRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const loadUVData = async () => {
    // Cancel any previous request
    cancelToken(cancelTokenRef.current);

    // Create new cancel token for this request
    const currentToken = createCancelToken();
    cancelTokenRef.current = currentToken;

    if (!lat || !lon) {
      return;
    }

    startLoading();
    setError(null);

    try {
      const [uvData, weatherData] = await Promise.all([
        fetchUVIndex(lat, lon),
        fetchWeather(lat, lon),
      ]);
      const uvIndex = getCurrentUVIndex(uvData);

      // Check if this request was cancelled before setting state
      if (isCancelled(currentToken)) {
        return;
      }

      // Use utility functions for UV index info and protection advice
      const riskInfo = getUVIndexInfo(uvIndex);
      const protectionInfo = getUVProtectionAdvice(uvIndex);

      const data: UVData = {
        uvIndex,
        riskLevel: riskInfo.label,
        color: riskInfo.color,
        sunrise: formatUnixTime(weatherData.sys.sunrise),
        sunset: formatUnixTime(weatherData.sys.sunset),
        peakUVTime: "12:00 PM - 2:00 PM",
        recommendation: protectionInfo.advice,
        spfRecommendation: protectionInfo.spf,
      };

      // Final check before setting state
      if (!isCancelled(currentToken)) {
        setTimeout(() => {
          if (!isCancelled(currentToken)) {
            setUvData(data);
            finishLoading();
          }
        }, 300);
      }
    } catch (err: any) {
      // Only update state if request wasn't cancelled
      if (!isCancelled(currentToken)) {
        console.error("Error fetching UV data:", err);
        setError("Failed to load UV index data");
        finishLoading();
      }
    }
  };

  useEffect(() => {
    loadUVData();
  }, [lat, lon]);

  if (loading && !uvData) {
    return <LoadingCard message="Loading UV index data..." />;
  }

  if (!uvData) {
    return <ErrorCard message="No UV index data available" />;
  }

  return (
    <>
      <GlobalAnimationStyles />

      <Card
        className={`card-hover ${fadeClass}`}
        style={cardStyles.base}
        role="article"
        aria-label="UV index and sun safety information"
      >
        <CardHeader
          style={{
            ...headerStyles.base,
            background: "#3b82f6",
          }}
        >
          <CardTitle style={headerStyles.title}>
            ☀️ UV Index & Sun Safety
          </CardTitle>
        </CardHeader>

        <CardBody style={bodyStyles.base}>
          <CircularIndicator
            value={uvData.uvIndex}
            label="UV INDEX"
            color={uvData.color}
          />

          <h3
            style={{
              margin: "0 0 1rem 0",
              color: uvData.color,
              fontSize: "1.2rem",
            }}
          >
            {uvData.riskLevel} Risk
          </h3>

          <div className="sun-times">
            <SunTime icon="🌅" label="Sunrise" time={uvData.sunrise} />
            <SunTime icon="🌇" label="Sunset" time={uvData.sunset} />
          </div>

          <InfoBadge icon="⚠️">Peak UV: {uvData.peakUVTime}</InfoBadge>

          <ProtectionTip
            title="🧴 Recommended Protection"
            content={`<strong>${uvData.spfRecommendation} sunscreen</strong><br />${uvData.recommendation}`}
          />
        </CardBody>
      </Card>

      {error && (
        <ErrorNotification
          message={error}
          onClose={() => setError(null)}
          type="warning"
        />
      )}
    </>
  );
}
