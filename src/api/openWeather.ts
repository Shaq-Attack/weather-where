export async function fetchWeather(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API error");
  return res.json();
}
