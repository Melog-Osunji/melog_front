import React, {createContext, useContext, useState, ReactNode} from 'react';
import Toast, {ToastType} from '@/components/common/Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({children}: ToastProviderProps) => {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = (
    message: string,
    type: ToastType = 'success',
    duration: number = 3000,
  ) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration,
    };

    // 이전 토스트가 있으면 숨기고 새 토스트 표시
    if (currentToast) {
      setCurrentToast(null);
      setTimeout(() => {
        setCurrentToast(newToast);
      }, 100);
    } else {
      setCurrentToast(newToast);
    }
  };

  const hideToast = () => {
    setCurrentToast(null);
  };

  return (
    <ToastContext.Provider value={{showToast, hideToast}}>
      {children}
      {currentToast && (
        <Toast
          message={currentToast.message}
          type={currentToast.type}
          visible={!!currentToast}
          onHide={hideToast}
          duration={currentToast.duration}
        />
      )}
    </ToastContext.Provider>
  );
};
