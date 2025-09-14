import { useEffect, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { WeatherCard } from "./components/WeatherCard";
import { WeatherAppBar } from "./components/WeatherAppBar";
import { ForecastCard } from "./components/ForecastCard";
import { FunFactCard } from "./components/FunFactCard";
import { HourlyGrid } from "./components/HourlyGrid";
import "./App.css";
import cityList from '../city.list.json';

export default function App() {
  const { coords, error: geoError, permissionDenied } = useGeolocation();
  const { data: weatherData, loading, error, fetchWeatherData } = useWeather();
  const [selectedCity, setSelectedCity] = useLocalStorage<string | null>('selectedCity', null);
  const [isCelsius, setIsCelsius] = useLocalStorage<boolean>('isCelsius', true);
  const [userSelectedCity, setUserSelectedCity] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const handleUnitToggle = async () => {
    const newIsCelsius = !isCelsius;
    setIsCelsius(newIsCelsius);
    
    if (lat && lon) {
      const units = newIsCelsius ? 'metric' : 'imperial';
      await fetchWeatherData(lat, lon, units);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setUserSelectedCity(true);
  };

    const topCities = cityList.filter(city => {
      const selectedCountries = ['GB', 'US', 'JP', 'ZA', 'AU'];
      return selectedCountries.includes(city.country);
    })
  
  const cityOptions = topCities.map(city => ({
  label: `${city.name}`,
  value: city.id,
  coordinates: { lat: city.coord.lat, lon: city.coord.lon }
  }));

  useEffect(() => {
    const loadWeatherData = async () => {
      let targetLat: number;
      let targetLon: number;

      if (userSelectedCity && selectedCity) {
        const city = cityOptions.find(c => c.label === selectedCity);
        if (!city) return;
        targetLat = city.coordinates.lat;
        targetLon = city.coordinates.lon;
      } else if (coords) {
        targetLat = coords.lat;
        targetLon = coords.lon;
      } else if (geoError || permissionDenied) {
        const defaultCity = cityOptions[0];
        targetLat = defaultCity.coordinates.lat;
        targetLon = defaultCity.coordinates.lon;
      } else {
        return;
      }

      setLat(targetLat);
      setLon(targetLon);
      
      const units = isCelsius ? 'metric' : 'imperial';
      await fetchWeatherData(targetLat, targetLon, units);
    };

    loadWeatherData();
  }, [coords, selectedCity, userSelectedCity, geoError, permissionDenied, isCelsius, fetchWeatherData]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'flex-start',
      minHeight: '100vh',
      paddingTop: '80px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minWidth: '100vw'
    }}>
      <WeatherAppBar
        cities={cityOptions.map(c => c.label)}
        city={selectedCity || ""}
        onCityChange={handleCityChange}
        isCelsius={isCelsius}
        onUnitToggle={handleUnitToggle}
      />
      
      <div style={{ 
        maxWidth: '1500px', 
        width: '100%', 
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Current Weather Card */}
        <WeatherCard 
          loading={loading} 
          error={error || geoError} 
          data={weatherData?.current} 
          isCelsius={isCelsius} 
        />
        
        {/* Forecast Card */}
        {weatherData?.daily && weatherData?.hourly && (
          <ForecastCard 
            daily={weatherData.daily}
            hourly={weatherData.hourly}
            isCelsius={isCelsius}
            timezoneOffset={weatherData.timezone_offset}
          />
        )}
        
        {/* Fun Fact Card */}
        {weatherData?.current && (
          <FunFactCard 
            cityName={weatherData.current.name}
            countryCode={weatherData.current.sys?.country}
          />
        )}
        
        {/* Hourly Grid */}
        {weatherData?.hourly && (
          <HourlyGrid 
            hourly={weatherData.hourly}
            isCelsius={isCelsius}
            timezoneOffset={weatherData.timezone_offset}
          />
        )}
      </div>
    </div>
  );
}
