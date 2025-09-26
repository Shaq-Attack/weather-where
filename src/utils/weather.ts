/**
 * Weather-related utility functions for mapping conditions, icons, and styles
 */

// Weather condition mappings
export const weatherConditions = {
  CLEAR: 'clear',
  CLOUDS: 'cloud',
  RAIN: 'rain',
  DRIZZLE: 'drizzle',
  THUNDERSTORM: 'thunderstorm',
  SNOW: 'snow',
  MIST: 'mist',
  FOG: 'fog',
  HAZE: 'haze',
} as const;

// Weather background gradients
export const weatherBackgrounds = {
  [weatherConditions.RAIN]: "linear-gradient(135deg, rgba(74, 144, 226, 0.9), rgba(0, 91, 234, 0.9))",
  [weatherConditions.DRIZZLE]: "linear-gradient(135deg, rgba(74, 144, 226, 0.9), rgba(0, 91, 234, 0.9))",
  [weatherConditions.THUNDERSTORM]: "linear-gradient(135deg, rgba(44, 62, 80, 0.9), rgba(52, 73, 94, 0.9))",
  [weatherConditions.CLOUDS]: "linear-gradient(135deg, rgba(189, 195, 199, 0.9), rgba(44, 62, 80, 0.9))",
  [weatherConditions.SNOW]: "linear-gradient(135deg, rgba(131, 164, 212, 0.9), rgba(182, 251, 255, 0.9))",
  [weatherConditions.CLEAR]: "linear-gradient(135deg, rgba(247, 151, 30, 0.9), rgba(255, 210, 0, 0.9))",
  [weatherConditions.MIST]: "linear-gradient(135deg, rgba(189, 195, 199, 0.9), rgba(44, 62, 80, 0.9))",
  [weatherConditions.FOG]: "linear-gradient(135deg, rgba(189, 195, 199, 0.9), rgba(44, 62, 80, 0.9))",
  [weatherConditions.HAZE]: "linear-gradient(135deg, rgba(189, 195, 199, 0.9), rgba(44, 62, 80, 0.9))",
} as const;

// Darker weather backgrounds for hover states
export const weatherBackgroundsDark = {
  [weatherConditions.RAIN]: "linear-gradient(135deg, rgba(44, 90, 160, 0.95), rgba(0, 51, 136, 0.95))",
  [weatherConditions.DRIZZLE]: "linear-gradient(135deg, rgba(44, 90, 160, 0.95), rgba(0, 51, 136, 0.95))",
  [weatherConditions.THUNDERSTORM]: "linear-gradient(135deg, rgba(26, 37, 47, 0.95), rgba(31, 41, 55, 0.95))",
  [weatherConditions.CLOUDS]: "linear-gradient(135deg, rgba(127, 140, 141, 0.95), rgba(26, 37, 47, 0.95))",
  [weatherConditions.SNOW]: "linear-gradient(135deg, rgba(90, 127, 167, 0.95), rgba(125, 211, 255, 0.95))",
  [weatherConditions.CLEAR]: "linear-gradient(135deg, rgba(204, 85, 0, 0.95), rgba(230, 172, 0, 0.95))",
  [weatherConditions.MIST]: "linear-gradient(135deg, rgba(127, 140, 141, 0.95), rgba(26, 37, 47, 0.95))",
  [weatherConditions.FOG]: "linear-gradient(135deg, rgba(127, 140, 141, 0.95), rgba(26, 37, 47, 0.95))",
  [weatherConditions.HAZE]: "linear-gradient(135deg, rgba(127, 140, 141, 0.95), rgba(26, 37, 47, 0.95))",
} as const;

/**
 * Normalize weather condition string to standard format
 */
export function normalizeWeatherCondition(condition: string): string {
  const normalized = condition.toLowerCase().trim();
  
  if (normalized.includes('rain')) return weatherConditions.RAIN;
  if (normalized.includes('drizzle')) return weatherConditions.DRIZZLE;
  if (normalized.includes('thunderstorm') || normalized.includes('thunder')) return weatherConditions.THUNDERSTORM;
  if (normalized.includes('cloud') || normalized.includes('overcast')) return weatherConditions.CLOUDS;
  if (normalized.includes('snow') || normalized.includes('sleet')) return weatherConditions.SNOW;
  if (normalized.includes('clear') || normalized.includes('sunny')) return weatherConditions.CLEAR;
  if (normalized.includes('mist')) return weatherConditions.MIST;
  if (normalized.includes('fog')) return weatherConditions.FOG;
  if (normalized.includes('haze') || normalized.includes('smoke')) return weatherConditions.HAZE;
  
  // Default fallback
  return weatherConditions.CLEAR;
}

/**
 * Get weather background gradient for a condition
 */
export function getWeatherBackground(condition: string, isDark = false): string {
  const normalized = normalizeWeatherCondition(condition);
  const backgrounds = isDark ? weatherBackgroundsDark : weatherBackgrounds;
  return backgrounds[normalized as keyof typeof backgrounds] || backgrounds[weatherConditions.CLEAR];
}

/**
 * UV Index risk level mapping
 */
export const uvIndexLevels = {
  NO_RISK: { min: 0, max: 0, label: "No Risk", color: "#6c757d" },
  LOW: { min: 1, max: 2, label: "Low", color: "#289500" },
  MODERATE: { min: 3, max: 5, label: "Moderate", color: "#f7e400" },
  HIGH: { min: 6, max: 7, label: "High", color: "#f85900" },
  VERY_HIGH: { min: 8, max: 10, label: "Very High", color: "#d8001d" },
  EXTREME: { min: 11, max: 20, label: "Extreme", color: "#6b49c8" },
} as const;

/**
 * Get UV index risk information
 */
export function getUVIndexInfo(uvIndex: number) {
  for (const level of Object.values(uvIndexLevels)) {
    if (uvIndex >= level.min && uvIndex <= level.max) {
      return level;
    }
  }
  
  // Default to extreme for very high values
  return uvIndexLevels.EXTREME;
}

/**
 * Get UV protection recommendations
 */
export function getUVProtectionAdvice(uvIndex: number) {
  if (uvIndex === 0) {
    return {
      spf: "No protection needed",
      advice: "No UV exposure risk at this time (nighttime hours or overcast conditions)."
    };
  }
  
  if (uvIndex <= 2) {
    return {
      spf: "SPF 15+",
      advice: "No protection needed. You can safely enjoy the outdoors!"
    };
  }
  
  if (uvIndex <= 5) {
    return {
      spf: "SPF 30+",
      advice: "Some protection required. Seek shade during midday hours."
    };
  }
  
  if (uvIndex <= 7) {
    return {
      spf: "SPF 30+",
      advice: "Protection required. Seek shade and wear protective clothing."
    };
  }
  
  if (uvIndex <= 10) {
    return {
      spf: "SPF 50+",
      advice: "Extra protection required. Avoid being outside during midday hours."
    };
  }
  
  return {
    spf: "SPF 50+",
    advice: "Avoid outside exposure. Take all precautions."
  };
}

/**
 * Air Quality Index levels and colors
 */
export const aqiLevels = {
  GOOD: { min: 0, max: 50, label: "Good", color: "#00e400" },
  MODERATE: { min: 51, max: 100, label: "Moderate", color: "#ffff00" },
  UNHEALTHY_FOR_SENSITIVE: { min: 101, max: 150, label: "Unhealthy for Sensitive Groups", color: "#ff7e00" },
  UNHEALTHY: { min: 151, max: 200, label: "Unhealthy", color: "#ff0000" },
  VERY_UNHEALTHY: { min: 201, max: 300, label: "Very Unhealthy", color: "#8f3f97" },
  HAZARDOUS: { min: 301, max: 500, label: "Hazardous", color: "#7e0023" },
} as const;

/**
 * Get AQI level information
 */
export function getAQIInfo(aqi: number) {
  for (const level of Object.values(aqiLevels)) {
    if (aqi >= level.min && aqi <= level.max) {
      return level;
    }
  }
  
  // Default to hazardous for very high values
  return aqiLevels.HAZARDOUS;
}
