import { useState, useEffect } from "react";
import * as Location from "expo-location";
import axios from "axios";

export const useEvents = (latitude, longitude) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (latitude && longitude) {
        try {
          const response = await axios.get(
            "https://app.ticketmaster.com/discovery/v2/events.json",
            {
              params: {
                apikey: "fbAxXXgAd8mDEingIoGHggKxmQ9GW45A",
                latlong: `${latitude},${longitude}`, // Buradaki `${}` hatası düzeltilmiş
                radius: 300,
                unit: "km",
                sort: "date,asc",
              },
            }
          );

          if (response.data?._embedded?.events) {
            const uniqueCategories = new Set(["All"]);
            response.data._embedded.events.forEach((event) => {
              event.classifications?.forEach((cls) => {
                uniqueCategories.add(cls.segment.name);
              });
            });

            setCategories(Array.from(uniqueCategories));
            setData(response.data._embedded.events);
          } else {
            setErrorMsg("Etkinlik bulunamadı");
          }
        } catch (err) {
          console.error("Etkinlikleri çekerken hata oluştu:", err);
          setErrorMsg("Etkinlikleri alırken bir hata oluştu");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
  }, [latitude, longitude]);

  return { data, categories, isLoading, errorMsg };
};
