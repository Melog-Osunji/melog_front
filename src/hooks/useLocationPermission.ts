import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';

function useLocationPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    async function requestPermission() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (error) {
          console.warn('Permission error:', error);
          setHasPermission(false);
        }
      } else {
        setHasPermission(true); // iOS는 Info.plist 설정만 하면 됨
      }
    }

    requestPermission();
  }, []);

  return hasPermission;
}

export default useLocationPermission;
