import React from 'react';
import MainTabNavigator from '@/navigations/tab/MainTabNavigator';
import AuthStackNavigator from '@/navigations/stack/IntroStackNavigator';
import {useAuthContext} from '@/contexts/AuthContext';
import {tapGestureHandlerProps} from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';

function RootNavigator() {
  const {isLogin, setIsLogin} = useAuthContext();
  setIsLogin(true); // 임시로 로그인 상태를 true로 설정, 실제 앱에서는 로그인 상태에 따라 변경해야 함
  return <>{isLogin ? <MainTabNavigator /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
RootNavigator;
