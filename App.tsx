import React, {useEffect} from 'react';
import queryClient from './src/api/queryClient';
import {QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@/contexts/AuthContext';
import {ToastProvider} from '@/contexts/ToastContext';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/navigations/root/RootNavigator';
import {getAccessToken, getRefreshToken} from '@/utils/storage/UserStorage';

function App() {
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
