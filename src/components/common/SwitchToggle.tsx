import React, { memo, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  ViewStyle,
  ColorValue,
  AccessibilityActionEvent,
} from 'react-native';
import { colors } from '@/constants';

type ToggleSize = 'sm' | 'md' | 'lg';

type ToggleProps = {
  /** 현재 값 (제어 컴포넌트) */
  value: boolean;
  /** 값 변경 콜백 */
  onValueChange: (next: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 크기 프리셋 */
  size?: ToggleSize;
  /** 켜짐 트랙 색상 */
  onColor?: ColorValue;
  /** 꺼짐 트랙 색상 */
  offColor?: ColorValue;
  /** thumb(동그라미) 켜짐 색상 */
  thumbOnColor?: ColorValue;
  /** thumb(동그라미) 꺼짐 색상 */
  thumbOffColor?: ColorValue;
  /** 외부 스타일(마진 등) */
  style?: ViewStyle;
  /** 애니메이션 지속 시간(ms) */
  animationDuration?: number;
  /** 터치 영역 확장 */
  hitSlop?: { top?: number; bottom?: number; left?: number; right?: number };
  /** 테스트용 */
  testID?: string;
};

const SIZE_MAP: Record<ToggleSize, { width: number; height: number; padding: number; thumb: number }> = {
  sm: { width: 36, height: 20, padding: 2, thumb: 16 },
  md: { width: 55, height: 30, padding: 3, thumb: 24 },
  lg: { width: 64, height: 36, padding: 3, thumb: 30 },
};

const SwitchToggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  onColor = colors.BLUE_400,
  offColor = colors.GRAY_200,
  thumbOnColor = colors.WHITE,
  thumbOffColor = colors.WHITE,
  style,
  animationDuration = 160,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
  testID,
}) => {
  const dims = SIZE_MAP[size];
  const radius = dims.height / 2;

  // 0(꺼짐) ~ 1(켜짐) 진행도
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  // 외부에서 value가 바뀌면 애니메이션 반영
  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: animationDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // translateX/배경색 보간 때문에 false
    }).start();
  }, [value, animationDuration, progress]);

  const maxTranslate = useMemo(
    () => dims.width - dims.padding * 2 - dims.thumb,
    [dims.width, dims.padding, dims.thumb]
  );

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxTranslate],
  });

  // RN의 Animated에는 interpolateColor가 있어요(RN 0.62+).
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [offColor as string, onColor as string],
    });

  const thumbBg = (Animated as any).interpolateColor
    ? (progress as any).interpolate({
        inputRange: [0, 1],
        outputRange: [thumbOffColor as string, thumbOnColor as string],
      })
    : thumbOffColor;

  const toggle = useCallback(() => {
    if (disabled) return;
    onValueChange(!value);
  }, [disabled, onValueChange, value]);

  const onAccessibilityAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === 'activate') toggle();
  };

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      hitSlop={hitSlop}
      style={[styles.wrap, style, disabled && styles.disabled]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={onAccessibilityAction}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: dims.width,
            height: dims.height,
            borderRadius: radius,
            backgroundColor,
            padding: dims.padding,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dims.thumb,
              height: dims.thumb,
              borderRadius: dims.thumb / 2,
              transform: [{ translateX }],
              backgroundColor: thumbBg,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default memo(SwitchToggle);

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
  },
  track: {
    justifyContent: 'center',
  },
  thumb: {
    // 살짝의 그림자(안드로이드/ios 공통 최소치)
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
