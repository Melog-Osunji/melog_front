import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  visible,
  onHide,
  duration = 3000,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  console.log('🍞 Toast 렌더링:', {message, type, visible});

  useEffect(() => {
    console.log('🍞 Toast useEffect:', {visible});

    if (visible) {
      console.log('🍞 Toast 애니메이션 시작');

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
      ]).start(() => {
        console.log('🍞 Toast 표시 완료');
      });

      // 일정 시간 후 자동으로 숨기기
      const timer = setTimeout(() => {
        console.log('🍞 Toast 자동 숨김 실행');
        hideToast();
      }, duration);

      return () => {
        console.log('🍞 Toast cleanup');
        clearTimeout(timer);
      };
    }
  }, [visible, duration]);

  const hideToast = () => {
    console.log('🍞 Toast hideToast 실행');

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
      console.log('🍞 Toast 숨김 완료');
      onHide();
    });
  };

  const getToastIcon = () => {
    try {
      switch (type) {
        case 'success':
          return require('@/assets/icons/Check.png');
        case 'error':
          // Error 아이콘이 없으면 기본 아이콘 사용
          return require('@/assets/icons/Check.png');
        case 'warning':
          // Warning 아이콘이 없으면 기본 아이콘 사용
          return require('@/assets/icons/Check.png');
        case 'info':
          // Info 아이콘이 없으면 기본 아이콘 사용
          return require('@/assets/icons/Check.png');
        default:
          return require('@/assets/icons/Check.png');
      }
    } catch (error) {
      console.warn('🍞 아이콘 로드 실패:', error);
      return require('@/assets/icons/Check.png');
    }
  };

  const getToastStyle = () => {
    const baseStyle = styles.toast;
    switch (type) {
      case 'success':
        return [baseStyle, styles.successToast];
      case 'error':
        return [baseStyle, styles.errorToast];
      case 'warning':
        return [baseStyle, styles.warningToast];
      case 'info':
        return [baseStyle, styles.infoToast];
      default:
        return [baseStyle, styles.successToast];
    }
  };

  if (!visible) {
    console.log('🍞 Toast visible=false, 렌더링 안함');
    return null;
  }

  console.log('🍞 Toast 최종 렌더링 시작');

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
