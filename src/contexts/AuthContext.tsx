import React, {createContext, useContext, useState} from 'react';

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <AuthContext.Provider value={{isLogin, setIsLogin}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
