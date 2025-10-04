import React from 'react';
import MainTabNavigator from '@/navigations/tab/MainTabNavigator';
import IntroStackNavigator from '@/navigations/stack/IntroStackNavigator';
import AuthStackNavigator from '@/navigations/stack/IntroStackNavigator';
import {useAuthContext} from '@/contexts/AuthContext';

function RootNavigator() {
  const {isLogin, setIsLogin} = useAuthContext();
  setIsLogin(true); // 테스트용 강제 로그아웃
  return <>{isLogin ? <MainTabNavigator /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
RootNavigator;
