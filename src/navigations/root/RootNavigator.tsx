import React, {useEffect, useState} from 'react';
import {useAuthContext} from '@/contexts/AuthContext';
import IntroStackNavigator from '@/navigations/stack/IntroStackNavigator';
import RegistrationStackNavigator from '@/navigations/stack/RegistrationStackNavigator';
import MainTabNavigator from '@/navigations/tab/MainTabNavigator';
import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import AlarmScreen from '@/screens/common/AlarmScreen';

const AppStack = createStackNavigator();

function RootNavigator() {
  const {isLogin, isRegistered, isLoading, setIsLogin, setIsRegistered} =
    useAuthContext();

  // 개발 모드에서 override가 적용되기 전까지 렌더 차단
  const [devOverrideApplied, setDevOverrideApplied] = useState(!__DEV__);

  // 무조건 실행할 WelcomeScreen 표시 플래그 (초기 2초간 강제 표시)
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // 개발 환경에서만 테스트 상태 설정
    if (__DEV__) {
      const TEST_SCENARIO = 'MAIN'; // 'LOGIN' | 'REGISTRATION' | 'MAIN'

      switch (TEST_SCENARIO) {
        case 'REGISTRATION':
          setIsLogin(true);
          setIsRegistered(false);
          console.log('[dev] 회원가입 프로세스 상태로 설정됨');
          break;
        case 'LOGIN':
          setIsLogin(false);
          setIsRegistered(true);
          console.log('[dev] 가입 이후 로그인 프로세스 상태로 설정됨');
          break;
        case 'MAIN':
          setIsLogin(true);
          setIsRegistered(true);
          break;
        default:
          setIsLogin(true);
          setIsRegistered(true);
          break;
      }
      // override 호출 직후에 플래그 세팅 (실제 상태 변경은 비동기지만
      // 이 플래그를 통해 초기 렌더링을 방지)
      setDevOverrideApplied(true);
    }
  }, []);

  useEffect(() => {
    // 초기 2초간은 무조건 WelcomeScreen 표시
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !devOverrideApplied || showWelcome) {
    return <WelcomeScreen />;
  }

  // 로그인되지 않은 경우 -> 로그인 화면
  if (!isLogin) {
    return <IntroStackNavigator />;
  }

  // 로그인은 됐지만 가입 프로세스가 완료되지 않은 경우 -> 가입 프로세스
  if (isLogin && !isRegistered) {
    return <RegistrationStackNavigator />;
  }

  // 로그인 + 가입 완료된 경우 -> 메인 앱
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="MainTab" component={MainTabNavigator} />
      <AppStack.Screen name="Alarm" component={AlarmScreen} />
    </AppStack.Navigator>
  );
}

export default RootNavigator;
