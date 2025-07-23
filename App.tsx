import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import queryClient from './src/api/queryClient';
import RootNavigator from '@/navigations/root/RootNavigator'; //auth부터
import {AuthProvider} from '@/contexts/AuthContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
