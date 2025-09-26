import { useEffect, useState } from "react";

// Hooks
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Components
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardWidgets } from "./components/DashboardWidgets";

// Weather Components
import { WeatherDashboardCards } from "./components/weather/WeatherDashboardCards";
import { ForecastScreen } from "./components/weather/ForecastScreen";
import { HourlyScreen } from "./components/weather/HourlyScreen";
import { WeatherDetailsScreen } from "./components/weather/WeatherDetailsScreen";

// Styles and Data
import "./App.css";
import cityList from "../city.list.json";
import "@progress/kendo-theme-material/dist/all.css";

export default function App() {
  const { coords, error: geoError, permissionDenied } = useGeolocation();
  const { data: weatherData, fetchWeatherData } = useWeather();
  const [selectedCity, setSelectedCity] = useLocalStorage<string | null>(
    "selectedCity",
    null,
  );
  const [isCelsius, setIsCelsius] = useLocalStorage<boolean>("isCelsius", true);
  const [userSelectedCity, setUserSelectedCity] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<string>("overview");

  const handleUnitToggle = async () => {
    const newIsCelsius = !isCelsius;
    setIsCelsius(newIsCelsius);

    if (lat && lon) {
      const units = newIsCelsius ? "metric" : "imperial";
      await fetchWeatherData(lat, lon, units);
    }
  };

  const handleCityChange = (city: string) => {
    if (city === "Your Location") {
      // User wants to use geolocation
      setSelectedCity(null);
      setUserSelectedCity(false);
    } else {
      // User selected a specific city
      setSelectedCity(city);
      setUserSelectedCity(true);
    }
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  // Ensure we always start on the overview page
  useEffect(() => {
    setCurrentView("overview");
  }, []); // Empty dependency array means this runs only once on mount

  // Filter cities from the imported list
  const topCities = cityList.filter((city: any) => {
    const selectedCountries = ["GB", "US", "JP", "ZA", "AU"];
    return selectedCountries.includes(city.country);
  });

  // Create city options with "Your Location" as first option
  const createCityOptions = () => {
    const cityList = topCities.map((city: any) => ({
      label: `${city.name}`,
      value: city.id,
      coordinates: { lat: city.coord.lat, lon: city.coord.lon },
    }));

    return cityList;
  };

  const cityOptions = createCityOptions();

  // Create dropdown list with "Your Location" option
  const getDropdownCities = () => {
    const cities = cityOptions.map((c: any) => c.label);

    // Only add "Your Location" if geolocation is available or already being used
    if (!geoError && !permissionDenied) {
      return ["Your Location", ...cities];
    }

    return cities;
  };

  useEffect(() => {
    const loadWeatherData = async () => {
      let targetLat: number;
      let targetLon: number;

      if (
        userSelectedCity &&
        selectedCity &&
        selectedCity !== "Your Location"
      ) {
        // User selected a specific city
        const city = cityOptions.find((c: any) => c.label === selectedCity);
        if (!city) return;
        targetLat = city.coordinates.lat;
        targetLon = city.coordinates.lon;
      } else if (
        coords &&
        (!userSelectedCity || selectedCity === "Your Location")
      ) {
        // Use geolocation (either auto or user selected "Your Location")
        targetLat = coords.lat;
        targetLon = coords.lon;
      } else if (geoError || permissionDenied) {
        // Fallback to default city if geolocation fails
        const defaultCity = cityOptions[0];
        targetLat = defaultCity.coordinates.lat;
        targetLon = defaultCity.coordinates.lon;
      } else {
        return;
      }

      setLat(targetLat);
      setLon(targetLon);

      const units = isCelsius ? "metric" : "imperial";
      await fetchWeatherData(targetLat, targetLon, units);
    };

    loadWeatherData();
  }, [
    coords,
    selectedCity,
    userSelectedCity,
    geoError,
    permissionDenied,
    isCelsius,
    fetchWeatherData,
  ]);

  // Get the value to show in the dropdown
  const getDropdownValue = () => {
    if (userSelectedCity && selectedCity) {
      return selectedCity;
    }
    if (coords && !userSelectedCity && !geoError && !permissionDenied) {
      return "Your Location";
    }
    return null;
  };

  // Render main content based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case "forecast":
        return (
          <ForecastScreen weatherData={weatherData} isCelsius={isCelsius} />
        );
      case "hourly":
        return <HourlyScreen weatherData={weatherData} isCelsius={isCelsius} />;
      case "details":
        return (
          <WeatherDetailsScreen
            weatherData={weatherData}
            isCelsius={isCelsius}
            lat={lat || undefined}
            lon={lon || undefined}
          />
        );
      case "overview":
      default:
        return (
          <WeatherDashboardCards
            weatherData={weatherData}
            isCelsius={isCelsius}
            lat={lat || undefined}
            lon={lon || undefined}
          />
        );
    }
  };

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          cities={getDropdownCities()}
          selectedCityValue={getDropdownValue()}
          onCityChange={handleCityChange}
          isCelsius={isCelsius}
          onUnitToggle={handleUnitToggle}
        />
      }
      sidebar={
        <DashboardSidebar
          onNavigate={handleNavigation}
          currentView={currentView}
        />
      }
      mainContent={renderMainContent()}
      rightPanel={
        currentView === "overview" ? (
          <DashboardWidgets lat={lat} lon={lon} />
        ) : null
      }
    />
  );
}
