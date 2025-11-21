import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Image} from 'react-native';
import {colors} from '@/constants';

export type ToastType = 'none' | 'success' | 'error';
export type ToastPosition = 'top' | 'bottom';

interface ToastProps {
  message: string;
  type?: ToastType; //'none' | 'success' | 'error';
  visible: boolean;
  position?: ToastPosition; // 'top' | 'bottom'
  offset?: number; // px 단위
  onHide: () => void;
}

const iconMap = {
  success: require('@/assets/icons/common/check_circle.png'),
  error: require('@/assets/icons/common/error.png'),
};

const iconColorMap = {
  success: colors.BLUE_400,
  error: colors.ERROR_RED,
};

function Toast({
  message,
  type = 'none',
  visible,
  onHide,
  position = 'top',
  offset = 82,
}: ToastProps) {
  const initialTranslate = position === 'top' ? -100 : 100;
  const translateY = useRef(new Animated.Value(initialTranslate)).current;
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

      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [visible, position]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: initialTranslate,
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

  const positionStyle =
    position === 'top'
      ? {
          position: 'absolute' as 'absolute',
          top: offset,
          left: 0,
          right: 0,
          zIndex: 999,
          alignItems: 'center' as const,
        }
      : {
          position: 'absolute' as 'absolute',
          bottom: offset,
          left: 0,
          right: 0,
          zIndex: 999,
          alignItems: 'center' as const,
        };

  if (!visible) return null;

  return (
    <View style={positionStyle}>
      <Animated.View
        style={[
          styles.toastContainer,
          {
            transform: [{translateY}],
            opacity,
          },
        ]}>
        {type !== 'none' && (
          <Image
            source={iconMap[type]}
            style={[styles.icon, {tintColor: iconColorMap[type]}]}
          />
        )}
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 10,
    height: 48,
    width: '90%',
    borderRadius: 8,
    backgroundColor: 'rgba(99, 108, 115, 0.7)',
  },
  icon: {
    width: 24,
    height: 24,
  },
  toastText: {
    color: colors.WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Toast;
