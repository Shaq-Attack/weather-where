import { useEffect, useState } from "react";

interface Coords {
  lat: number;
  lon: number;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setError(null);
          setPermissionDenied(false);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setError(err.message);
          // Check if permission was denied
          if (err.code === 1) { // PERMISSION_DENIED
            setPermissionDenied(true);
          }
          setCoords(null);
        }
      );
    } else {
      setError("Geolocation not supported");
      setCoords(null);
    }
  }, []);

  return { coords, error, permissionDenied };
}
