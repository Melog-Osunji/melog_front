import React, {useEffect} from 'react';
import IntroStackNavigator from '@/navigations/stack/IntroStackNavigator';
import MainTabNavigator from '@/navigations/tab/MainTabNavigator';
import RegistrationStackNavigator from '@/navigations/stack/RegistrationStackNavigator';
import {useAuthContext} from '@/contexts/AuthContext';

function RootNavigator() {
  const {isLogin, isRegistered, isLoading, setIsLogin, setIsRegistered} =
    useAuthContext();

  useEffect(() => {
    // 개발 환경에서만 테스트 상태 설정
    if (__DEV__) {
      const TEST_SCENARIO = 'MAIN'; // 'LOGIN' | 'REGISTRATION' | 'MAIN'

      switch (TEST_SCENARIO) {
        case 'REGISTRATION':
          setIsLogin(false);
          setIsRegistered(false);
          console.log('[dev] 회원가입 프로세스 상태로 설정됨');
          break;
        case 'LOGIN':
          setIsLogin(false);
          setIsRegistered(true);
          console.log('[dev] 가입 이후 로그인 프로세스 상태로 설정됨', isLogin);
          break;
        case 'MAIN':
          setIsLogin(true);
          setIsRegistered(true);
          break;
      }
    }
  }, []);

  if (isLoading) {
    // 로딩 화면 표시
    return null; // 또는 로딩 컴포넌트
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
  return <MainTabNavigator />;
}

export default RootNavigator;
