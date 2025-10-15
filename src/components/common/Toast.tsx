import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Image,
} from 'react-native';

export type ToastType = 'none' | 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'none',
  visible,
  onHide,
  duration = 3000,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 토스트 보이기
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 일정 시간 후 자동으로 숨기기
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastIcon = () => {
    try {
      switch (type) {
        case 'none':
          return;
        case 'success':
          return require('@/assets/icons/Check.png');
        case 'error':
          return require('@/assets/icons/Check.png');
        case 'info':
          return require('@/assets/icons/Check.png');
        default:
          return require('@/assets/icons/Check.png');
      }
    } catch (error) {
      return require('@/assets/icons/Check.png');
    }
  };

  const getToastStyle = () => {
    const baseStyle = styles.toast;
    switch (type) {
      case 'success':
        return [baseStyle];
      case 'success':
        return [baseStyle, styles.successToast];
      case 'error':
        return [baseStyle, styles.errorToast];
      case 'info':
        return [baseStyle, styles.infoToast];
      default:
        return [baseStyle, styles.successToast];
    }
  };

  if (!visible) {
    return null;
  }

  return React.createElement(
    View,
    {style: styles.container},
    React.createElement(
      SafeAreaView,
      null,
      React.createElement(
        Animated.View,
        {
          style: [
            getToastStyle(),
            {
              transform: [{translateY}],
              opacity,
            },
          ],
        },
        React.createElement(Image, {
          source: getToastIcon(),
          style: styles.checkIcon,
        }),
        React.createElement(Text, {style: styles.message}, message),
      ),
    ),
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 10,
    height: 48,
    width: '90%',
    borderRadius: 8,
    backgroundColor: 'rgba(99, 108, 115, 0.7)',
  },
  successToast: {},
  errorToast: {},
  warningToast: {},
  infoToast: {},
  checkIcon: {
    width: 24,
    height: 24,
  },
  message: {
    fontFamily: 'Noto Sans KR',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.15,
    color: '#FFFFFF',
    flex: 1,
  },
});

export default Toast;
