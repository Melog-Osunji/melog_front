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

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Toast: React.FC<ToastProps> = ({
  message,
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

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

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

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Animated.View
          style={[
            styles.toast,
            {
              transform: [{translateY}],
              opacity,
            },
          ]}>
          <Image
            source={require('@/assets/icons/Check.png')}
            style={styles.checkIcon}
          />
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
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
    backgroundColor: 'rgba(99, 108, 115, 0.7)',
    borderRadius: 8,
  },
  checkIcon: {
    width: 24,
    height: 24,
  },
  message: {
    width: 238,
    height: 22,
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
