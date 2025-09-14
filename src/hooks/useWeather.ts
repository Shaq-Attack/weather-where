import { useState, useCallback } from 'react';
import { fetchWeather, fetchForecast, ForecastDay, ForecastHour, isOneCallResponse, convertToDaily, convertToHourly } from '../api/openWeather';

export interface WeatherData {
  current: any;
  daily: ForecastDay[];
  hourly: ForecastHour[];
  timezone?: string;
  timezone_offset?: number;
}

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
  ttl: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const weatherCache = new Map<string, CacheEntry>();

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const getCacheKey = (lat: number, lon: number, units: string) => {
    return `${lat}_${lon}_${units}`;
  };

  const getFromCache = (key: string): WeatherData | null => {
    const entry = weatherCache.get(key);
    if (entry && Date.now() < entry.timestamp + entry.ttl) {
      return entry.data;
    }
    // Remove expired entry
    if (entry) {
      weatherCache.delete(key);
    }
    return null;
  };

  const setToCache = (key: string, data: WeatherData) => {
    weatherCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    });
  };

  const fetchWeatherData = useCallback(async (
    lat: number,
    lon: number,
    units: 'metric' | 'imperial' = 'metric',
    forceRefresh = false
  ) => {
    const cacheKey = getCacheKey(lat, lon, units);
    
    // Check cache first
    if (!forceRefresh) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setState({ data: cachedData, loading: false, error: null });
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch current weather and forecast concurrently
      const [currentWeather, forecastData] = await Promise.all([
        fetchWeather(lat, lon, units),
        fetchForecast(lat, lon, units),
      ]);

      let daily: ForecastDay[];
      let hourly: ForecastHour[];
      let timezone: string | undefined;
      let timezone_offset: number | undefined;

      if (isOneCallResponse(forecastData)) {
        // OneCall API response
        daily = forecastData.daily.slice(0, 7); // Next 7 days
        hourly = forecastData.hourly.slice(0, 48); // Next 48 hours
        timezone = forecastData.timezone;
        timezone_offset = forecastData.timezone_offset;
      } else {
        // 5-day/3-hour forecast response
        daily = convertToDaily(forecastData).slice(0, 7);
        hourly = convertToHourly(forecastData);
        timezone_offset = forecastData.city.timezone;
      }

      const weatherData: WeatherData = {
        current: currentWeather,
        daily,
        hourly,
        timezone,
        timezone_offset,
      };

      // Cache the data
      setToCache(cacheKey, weatherData);

      setState({ data: weatherData, loading: false, error: null });
    } catch (error: any) {
      console.error('Weather fetch error:', error);
      
      // Try to use cached data even if expired
      const cachedData = weatherCache.get(cacheKey)?.data;
      if (cachedData) {
        setState({ 
          data: cachedData, 
          loading: false, 
          error: `Using cached data: ${error.message}` 
        });
      } else {
        setState({ data: null, loading: false, error: error.message });
      }
    }
  }, []);

  const clearCache = useCallback(() => {
    weatherCache.clear();
  }, []);

  const refreshWeather = useCallback((lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') => {
    return fetchWeatherData(lat, lon, units, true);
  }, [fetchWeatherData]);

  return {
    ...state,
    fetchWeatherData,
    refreshWeather,
    clearCache,
  };
}
