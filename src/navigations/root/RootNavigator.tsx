import React from 'react';
import MainTabNavigator from '@/navigations/tab/MainTabNavigator';
import IntroStackNavigator from '@/navigations/stack/IntroStackNavigator';
import {useAuthContext} from '@/contexts/AuthContext';

function RootNavigator() {
  const {isLogin, setIsLogin} = useAuthContext();
  return <>{isLogin ? <MainTabNavigator /> : <IntroStackNavigator />}</>;
}

export default RootNavigator;
RootNavigator;
