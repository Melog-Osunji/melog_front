// RefreshTokenCheck.tsx
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RefreshTokenCheck: React.FC = () => {
  useEffect(() => {
    const verifyAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.log('No access token found');
        return;
      }

      try {
        const response = await fetch(
          'https://your-backend.com/api/auth/verify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('유효하지 않은 토큰');
        }

        const {refreshToken} = await response.json();
        console.log('새로운 리프레시 토큰:', refreshToken);

        // TODO: refreshToken 저장 필요 시
        await AsyncStorage.setItem('refreshToken', refreshToken);
      } catch (error) {
        Alert.alert('토큰 확인 실패', '로그인을 다시 시도해주세요.');
        console.error(error);
      }
    };

    verifyAccessToken();
  }, []);

  return null;
};

export default RefreshTokenCheck;
