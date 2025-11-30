import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getUserInfo,
  isLoggedIn,
  clearAuthData,
  getRegistrationStatus,
  setRegistrationStatus,
} from '@/utils/storage/UserStorage';
import instance from '@/api/axiosInstance'; // axios 인스턴스 import

import {ProfileDTO} from '@/types';

interface AuthContextType {
  user: ProfileDTO | null;
  isLogin: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  login: (userData: ProfileDTO) => void;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  completeRegistration: () => Promise<void>;
  // 새 함수: isLogin=false, isRegistered=false, refreshUserInfo 호출
  resetAuthState: () => Promise<void>;
  // 테스트용
  setIsLogin: (value: boolean) => void;
  setIsRegistered: (value: boolean) => void;
}

// 외부에서 (테스트 등) 사용되는 모듈 레벨 참조가 필요하면 Promise<void> 타입으로 선언
export let logout: () => Promise<void> = async () => {};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 변경: 함수 선언식 컴포넌트로 정의
export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<ProfileDTO | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await isLoggedIn();
      const registered = await getRegistrationStatus();

      if (loggedIn) {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUser(userInfo);
          setIsLogin(true);
        }
      }

      setIsRegistered(registered);
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: ProfileDTO) => {
    setUser(userData);
    setIsLogin(true);
  };

  // Provider 내의 실제 logout 구현. 모듈 레벨 logout 변수에 할당하여 외부에서 호출 가능하게 함.
  logout = async () => {
    try {
      await clearAuthData(); // 토큰/스토리지 비우기
      delete instance.defaults.headers.common.Authorization; // axios 헤더 클린업
      setUser(null);
      setIsLogin(false);
      setIsRegistered(false);
    } catch (err) {
      console.error('logout 실패:', err);
      throw err;
    }
  };

  const refreshUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo ?? null);
      // user 존재 여부로 isLogin 동기화
      setIsLogin(!!userInfo);
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
    }
  };

  const resetAuthState = async () => {
    try {
      // 실제로 로그아웃 절차 수행하고 사용자 정보 재동기화
      await logout();
      setIsRegistered(false);
      await refreshUserInfo();
    } catch (error) {
      console.error('resetAuthState 실패:', error);
    }
  };

  const completeRegistration = async () => {
    try {
      await setRegistrationStatus(true);
      setIsRegistered(true);
      console.log('가입 완료 처리됨');
    } catch (error) {
      console.error('가입 완료 처리 실패:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLogin,
    isRegistered,
    isLoading,
    login,
    logout: logout as () => Promise<void>,
    refreshUserInfo,
    completeRegistration,
    resetAuthState,
    setIsLogin,
    setIsRegistered,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 명시적으로 함수로 export
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
