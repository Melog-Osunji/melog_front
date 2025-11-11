import React, {useEffect} from 'react';
import queryClient from './src/api/queryClient';
import {QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@/contexts/AuthContext';
import {ToastProvider} from '@/contexts/ToastContext';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/navigations/root/RootNavigator';
import {getAccessToken, getRefreshToken} from '@/utils/storage/UserStorage';

function App() {
  useEffect(() => {
    // 개발용: 저장된 토큰 콘솔 출력 (민감 정보니 배포 전 제거)
    if (__DEV__) {
      (async () => {
        try {
          const access = await getAccessToken();
          const refresh = await getRefreshToken();
          console.log('[App] accessToken:', access);
          console.log('[App] refreshToken:', refresh);
        } catch (e) {
          console.warn('[App] token read error', e);
        }
      })();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
