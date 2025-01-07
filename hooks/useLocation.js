import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Konum izni verilmedi");
          return;
        }

        const location = await Location.getCurrentPositionAsync();
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } catch (err) {
        console.error("Konum alınırken hata:", err);
        setErrorMsg("Konum alınırken bir hata oluştu");
      }
    };

    fetchLocation();
  }, []);

  return { latitude, longitude, errorMsg };
};
