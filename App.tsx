import React, {useEffect} from 'react';
import queryClient from './src/api/queryClient';
import {QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@/contexts/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/navigations/root/RootNavigator';
import {getAccessToken, getRefreshToken} from '@/utils/storage/UserStorage';
import GlobalToast from '@/components/common/GlobalToast';
import {OverlayProvider} from '@/components/overlay/OverlayProvider';
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <OverlayProvider>
            <RootNavigator />
            <GlobalToast />
          </OverlayProvider>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
