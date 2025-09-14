import { useEffect, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { fetchWeather } from "./api/openWeather";
import { WeatherCard } from "./components/WeatherCard";
import { WeatherAppBar } from "./components/WeatherAppBar";
import "./App.css";
import cityList from '../city.list.json';

export default function App() {
  const { coords, error: geoError, permissionDenied } = useGeolocation();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSelectedCity, setUserSelectedCity] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const handleUnitToggle = async () => {
    const newIsCelsius = !isCelsius;
    setIsCelsius(newIsCelsius);
    
    if (lat && lon) {
      try {
        setLoading(true);
        const units = newIsCelsius ? 'metric' : 'imperial';
        const data = await fetchWeather(lat, lon, units);
        setWeather(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        let lat: number;
        let lon: number;

        if (userSelectedCity && selectedCity) {
          const city = cityOptions.find(c => c.label === selectedCity);
          if (!city) {
            setLoading(false);
            return;
          }
          lat = city.coordinates.lat;
          lon = city.coordinates.lon;
        } else if (coords) {
          lat = coords.lat;
          lon = coords.lon;
        } else if (geoError || permissionDenied) {
          const defaultCity = cityOptions[0];
          lat = defaultCity.coordinates.lat;
          lon = defaultCity.coordinates.lon;
        } else {
          setLoading(false);
          return;
        }

        setLat(lat);
        setLon(lon);
        const data = await fetchWeather(lat, lon);
        setWeather(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coords, selectedCity, userSelectedCity, geoError, permissionDenied])

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      paddingTop: '80px'
    }}>
      <WeatherAppBar
        cities={cityOptions.map(c => c.label)}
        city={selectedCity || ""}
        onCityChange={handleCityChange}
        isCelsius={isCelsius}
        onUnitToggle={handleUnitToggle}
      />
      <WeatherCard loading={loading} error={error || geoError} data={weather} isCelsius={isCelsius} />
    </div>
  );
}
