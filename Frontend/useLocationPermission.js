import { useEffect } from 'react';
import * as Location from 'expo-location';

const useLocationPermission = () => {
  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (fgStatus !== 'granted' || bgStatus !== 'granted') {
        alert('Autorisation de géolocalisation refusée 📍');
      }
    })();
  }, []);
};

export default useLocationPermission;
