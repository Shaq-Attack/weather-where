import { useEffect, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { WeatherDashboardCards } from "./components/WeatherDashboardCards";
import { DashboardWidgets } from "./components/DashboardWidgets";
import "./App.css";
import cityList from '../city.list.json';
import "@progress/kendo-theme-material/dist/all.css";

export default function App() {
  const { coords, error: geoError, permissionDenied } = useGeolocation();
  const { data: weatherData, fetchWeatherData } = useWeather();
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

  // Determine the display name for the current location
  const getDisplayLocationName = () => {
    if (userSelectedCity && selectedCity) {
      return selectedCity;
    }
    if (coords && !userSelectedCity) {
      return "Your Location";
    }
    return "";
  };

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          cities={cityOptions.map(c => c.label)}
          city={getDisplayLocationName()}
          selectedCityValue={userSelectedCity ? selectedCity : null}
          onCityChange={handleCityChange}
          isCelsius={isCelsius}
          onUnitToggle={handleUnitToggle}
        />
      }
      sidebar={
        <DashboardSidebar />
      }
      mainContent={
        <WeatherDashboardCards
          weatherData={weatherData}
          isCelsius={isCelsius}
        />
      }
      rightPanel={
        <DashboardWidgets />
      }
    />
  );
}
