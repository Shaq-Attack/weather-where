// Forecast API interfaces and functions
export interface ForecastHour {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  wind: {
    speed: number;
  };
  pop: number; // probability of precipitation
}

export interface ForecastDay {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  humidity: number;
  wind: {
    speed: number;
  };
  pop: number;
}

export interface OneCallResponse {
  timezone: string;
  timezone_offset: number;
  daily: ForecastDay[];
  hourly: ForecastHour[];
}

export interface FiveDay3HourResponse {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    pop: number;
    dt_txt: string;
  }[];
  city: {
    timezone: number;
  };
}

export async function fetchForecast(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<FiveDay3HourResponse> {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!API_KEY) {
    throw new Error('OpenWeather API key is not configured. Please check your .env file.');
  }
  
  // Use only the free tier 5-day/3-hour forecast API (2.5 version)
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(forecastUrl);
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeather API key in the .env file.');
    }
    throw new Error(`Forecast API error: ${res.status} - ${res.statusText}`);
  }
  
  return await res.json() as FiveDay3HourResponse;
}

// Note: OneCall API removed - using only free tier 2.5 API endpoints

// Convert 5-day/3-hour data to daily summaries
export function convertToDaily(data: FiveDay3HourResponse): ForecastDay[] {
  const dailyData: { [key: string]: any } = {};
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = {
        dt: item.dt,
        temps: [item.main.temp],
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
        humidity: item.main.humidity,
        wind: item.wind,
        pop: item.pop,
        count: 1
      };
    } else {
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
      dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      dailyData[date].humidity = (dailyData[date].humidity + item.main.humidity) / 2;
      dailyData[date].pop = Math.max(dailyData[date].pop, item.pop);
      dailyData[date].count++;
    }
  });
  
  return Object.values(dailyData).map((day: any) => ({
    dt: day.dt,
    temp: {
      min: day.temp_min,
      max: day.temp_max,
      day: day.temps.reduce((sum: number, temp: number) => sum + temp, 0) / day.temps.length
    },
    weather: [day.weather],
    humidity: Math.round(day.humidity),
    wind: day.wind,
    pop: day.pop
  }));
}

// Convert 5-day/3-hour data to hourly format (just reshaping)
export function convertToHourly(data: FiveDay3HourResponse): ForecastHour[] {
  return data.list.map(item => ({
    dt: item.dt,
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    humidity: item.main.humidity,
    weather: item.weather[0], // Take the first weather condition
    wind: item.wind,
    pop: item.pop
  }));
}

// Air Pollution API interfaces
export interface AirPollutionData {
  coord: {
    lon: number;
    lat: number;
  };
  list: {
    dt: number;
    main: {
      aqi: number; // Air Quality Index (1-5)
    };
    components: {
      co: number;    // Carbon monoxide (μg/m³)
      no: number;    // Nitric oxide (μg/m³)
      no2: number;   // Nitrogen dioxide (μg/m³)
      o3: number;    // Ozone (μg/m³)
      so2: number;   // Sulphur dioxide (μg/m³)
      pm2_5: number; // Fine particles matter (μg/m³)
      pm10: number;  // Coarse particulate matter (μg/m³)
      nh3: number;   // Ammonia (μg/m³)
    };
  }[];
}

export async function fetchAirPollution(lat: number, lon: number): Promise<AirPollutionData> {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Air Pollution API error: ${res.status}`);
  return res.json();
}

export async function fetchWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API error");
  return res.json();
}

// UV Index API interfaces and functions (using Open-Meteo API)
export interface UVIndexData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly_units: {
    time: string;
    uv_index: string;
  };
  hourly: {
    time: string[];
    uv_index: number[];
  };
}

export async function fetchUVIndex(lat: number, lon: number): Promise<UVIndexData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=uv_index&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`UV Index API error: ${res.status}`);
  return res.json();
}

// Helper function to get current UV index from hourly data
export function getCurrentUVIndex(uvData: UVIndexData): number {
  // Create a date object in the API's timezone
  const offsetMs = uvData.utc_offset_seconds * 1000;
  const now = new Date();
  const localTime = new Date(now.getTime() + offsetMs + (now.getTimezoneOffset() * 60000));
  const currentHour = localTime.getHours();
  
  // Find the closest time entry for current hour
  const hourlyTimes = uvData.hourly.time;
  const hourlyUVIndex = uvData.hourly.uv_index;
  
  // Get today's date in YYYY-MM-DD format (in API timezone)
  const today = localTime.toISOString().split('T')[0];
  
  // Find today's UV data - get the closest hour
  let closestIndex = -1;
  let closestHourDiff = 24;
  
  for (let i = 0; i < hourlyTimes.length; i++) {
    const timeEntry = hourlyTimes[i];
    if (timeEntry.startsWith(today)) {
      const entryHour = parseInt(timeEntry.split('T')[1].split(':')[0]);
      const hourDiff = Math.abs(entryHour - currentHour);
      
      if (hourDiff < closestHourDiff) {
        closestHourDiff = hourDiff;
        closestIndex = i;
      }
    }
  }
  
  if (closestIndex >= 0) {
    const uvValue = Math.round(hourlyUVIndex[closestIndex] || 0);
    
    // If it's nighttime (UV = 0) and between 10 PM and 6 AM, show today's peak UV instead
    if (uvValue === 0 && (currentHour >= 22 || currentHour <= 6)) {
      // Find today's peak UV value directly
      let peakValue = 0;
      for (let i = 0; i < hourlyTimes.length; i++) {
        const timeEntry = hourlyTimes[i];
        if (timeEntry.startsWith(today)) {
          const uvVal = hourlyUVIndex[i];
          if (uvVal > peakValue) {
            peakValue = uvVal;
          }
        }
      }
      if (peakValue > 0) {
        return Math.round(peakValue);
      }
    }
    
    return uvValue;
  }
  
  // Fallback: return first available UV index or 0
  const fallbackValue = Math.round(hourlyUVIndex[0] || 0);
  return fallbackValue;
}

// Helper function to get peak UV time and value for today
export function getTodayPeakUV(uvData: UVIndexData): { peakTime: string; peakValue: number } {
  // Create a date object in the API's timezone
  const offsetMs = uvData.utc_offset_seconds * 1000;
  const now = new Date();
  const localTime = new Date(now.getTime() + offsetMs + (now.getTimezoneOffset() * 60000));
  const today = localTime.toISOString().split('T')[0];
  
  let peakValue = 0;
  let peakTime = '12:00 PM';
  let peakHour = 12;
  
  for (let i = 0; i < uvData.hourly.time.length; i++) {
    const timeEntry = uvData.hourly.time[i];
    if (timeEntry.startsWith(today)) {
      const uvValue = uvData.hourly.uv_index[i];
      if (uvValue > peakValue) {
        peakValue = uvValue;
        peakHour = parseInt(timeEntry.split('T')[1].split(':')[0]);
      }
    }
  }
  
  // Format peak time
  if (peakHour === 0) {
    peakTime = '12:00 AM';
  } else if (peakHour < 12) {
    peakTime = `${peakHour}:00 AM`;
  } else if (peakHour === 12) {
    peakTime = '12:00 PM';
  } else {
    peakTime = `${peakHour - 12}:00 PM`;
  }
  
  return { peakTime, peakValue: Math.round(peakValue) };
}
