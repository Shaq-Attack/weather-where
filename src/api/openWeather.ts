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
  }[];
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

export async function fetchForecast(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<OneCallResponse | FiveDay3HourResponse> {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  // Try One Call API first (might require subscription)
  try {
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=${units}&appid=${API_KEY}`;
    const res = await fetch(oneCallUrl);
    
    if (res.ok) {
      return await res.json() as OneCallResponse;
    }
  } catch (error) {
    console.log('One Call API not available, falling back to 5-day forecast');
  }
  
  // Fallback to 5-day/3-hour forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(forecastUrl);
  
  if (!res.ok) {
    throw new Error(`Forecast API error: ${res.status}`);
  }
  
  return await res.json() as FiveDay3HourResponse;
}

// Helper function to determine if response is OneCall or 5-day format
export function isOneCallResponse(data: OneCallResponse | FiveDay3HourResponse): data is OneCallResponse {
  return 'daily' in data && 'hourly' in data;
}

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
    weather: item.weather,
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
