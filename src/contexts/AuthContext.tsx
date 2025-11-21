import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getUserInfo,
  isLoggedIn,
  clearAuthData,
  getRegistrationStatus,
  setRegistrationStatus,
} from '@/utils/storage/UserStorage';

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
  // 테스트용
  setIsLogin: (value: boolean) => void;
  setIsRegistered: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export let logout: () => void = () => {};

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

  logout = async () => {
    try {
      await clearAuthData();
      setUser(null);
      setIsLogin(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const refreshUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
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
