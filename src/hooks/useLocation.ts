import { useState } from "react";

export function useLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getLocation() {
    setLoading(true); 
    setError(null);
    
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        setLoading(false); 
        setError("Geolocation not supported");
        return reject(new Error("No geolocation"));
      }
      
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLoading(false);
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        err => { 
          setLoading(false); 
          setError(err.message); 
          reject(err); 
        },
        { enableHighAccuracy: false, maximumAge: 60_000, timeout: 15000 }
      );
    });
  }

  return { getLocation, loading, error };
}

