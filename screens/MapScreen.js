import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useLocation } from '../hooks/useLocation'; // Kendi hook'unuz

const GOOGLE_MAPS_APIKEY = 'API KEY'; // API anahtarınızı buraya ekleyin

const MapScreen = ({ route }) => {
  const { event } = route.params;

  // Venue içinden etkinlik konum bilgilerini çıkarıyoruz
  const venue = event?._embedded?.venues?.[0];
  const eventLatitude = parseFloat(venue?.location?.latitude);
  const eventLongitude = parseFloat(venue?.location?.longitude);

  // Kullanıcı lokasyonunu alıyoruz
  const { latitude, longitude, errorMsg } = useLocation(); // useLocation'ı doğru şekilde çağırıyoruz

  const [region, setRegion] = useState(null);
  const [distance, setDistance] = useState(null); // Mesafe
  const [duration, setDuration] = useState(null); // Süre
  const [showRoute, setShowRoute] = useState(false); // Rota gösterme durumu

  // Region güncellemelerini yapıyoruz
  useEffect(() => {
    if (latitude && longitude) {
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }, [latitude, longitude]);

  // Eğer konum bilgileri eksikse hata mesajı gösteriyoruz
  if (errorMsg || !latitude || !longitude || !eventLatitude || !eventLongitude) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Konum bilgileri Alınıyor!</Text>
      </View>
    );
  }

  // Yol tarifi hazır olduğunda mesafe ve süreyi alıyoruz
  const handleDirectionsReady = (result) => {
    setDistance(result.distance);  // Mesafe
    setDuration(result.duration);  // Süre
  };

  // Rota gösterme kontrolü
  const toggleRoute = () => setShowRoute((prevState) => !prevState);

  // Google Maps ile navigasyon başlatma
  const startNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${eventLatitude},${eventLongitude}`;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {/* Kullanıcı Konumu */}
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title="Mevcut Konum"
        />

        {/* Etkinlik Konumu */}
        <Marker
          coordinate={{
            latitude: eventLatitude,
            longitude: eventLongitude,
          }}
          title={event.name || 'Etkinlik'}
          description={venue?.name || 'Etkinlik Yeri'}
        />

        {/* Kullanıcı ve Etkinlik Konumu Arasındaki Rota */}
        {showRoute && (
          <MapViewDirections
            origin={{
              latitude: latitude,
              longitude: longitude,
            }}
            destination={{
              latitude: eventLatitude,
              longitude: eventLongitude,
            }}
            apikey={GOOGLE_MAPS_APIKEY} // Google Maps API Key
            strokeWidth={3}
            strokeColor="blue"
            onReady={handleDirectionsReady} // Rota hazır olduğunda mesafe ve süreyi al
          />
        )}
      </MapView>

      {/* Mesafe ve Süreyi Gösterme */}
      {distance && duration && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Mesafe: {distance.toFixed(2)} km</Text>
          <Text style={styles.infoText}>Tahmini Süre: {Math.round(duration)} dk</Text>
        </View>
      )}

      {/* Rota gösterme butonu */}
      <View style={styles.buttonContainer}>
        <Button title={showRoute ? 'Rotayı Gizle' : 'Rotayı Göster'} onPress={toggleRoute} />
      </View>

      {/* Google Maps ile navigasyonu başlatma */}
      <View style={styles.navigationButtonContainer}>
        <Button title="Navigasyonu Başlat" onPress={startNavigation} />
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    flex: 1,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  infoContainer: {
    position: 'absolute',
    top: 50, // Mesafe ve süreyi üstte konumlandırdık
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 10, // Diğer öğelerin üzerine gelsin
  },
  infoText: {
    fontSize: 16,
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
  },
  navigationButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
});
