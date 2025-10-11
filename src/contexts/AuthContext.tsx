import React, {createContext, useContext, useEffect, useState} from 'react';
import {getUserInfo, isLoggedIn, clearAuthData} from '@/utils/tokenStorage';

interface User {
  id: string;
  email: string;
  platform: string;
  nickName: string;
  profileImg: string;
  intro: string | null;
}

interface AuthContextType {
  user: User | null;
  isLogin: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  setIsLogin: (value: boolean) => void; //임시
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUser(userInfo);
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsLogin(true);
  };

  const logout = async () => {
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

  const value = {
    user,
    isLogin,
    isLoading,
    login,
    logout,
    refreshUserInfo,
    setIsLogin, // 추가하여 타입 일치
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 명시적으로 함수로 export
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User 타입도 export
export type {User};
