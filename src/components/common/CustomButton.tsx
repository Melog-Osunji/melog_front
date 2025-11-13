// components/common/CustomButton.tsx
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  PressableProps,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants';

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium' | 'small';
  inValid?: boolean;
  style?:
    | StyleProp<ViewStyle>
    | ((state: {pressed: boolean}) => StyleProp<ViewStyle>); // 명시적으로 View 스타일만, 함수 타입도 허용
}

const deviceHeight = Dimensions.get('screen').height;

export default function CustomButton({
  label,
  variant = 'filled',
  size = 'large',
  inValid = false,
  style: externalStyle,
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      disabled={inValid}
      // 내부 스타일 + 외부 스타일 병합
      style={state => {
        const base = [
          styles.container,
          styles[size],
          state.pressed ? styles[`${variant}Pressed`] : styles[variant],
          inValid && styles.inValid,
        ];
        // 부모가 style을 함수로 준 경우 pressed 상태를 전달해서 결과를 병합
        const ext =
          typeof externalStyle === 'function'
            ? externalStyle(state)
            : externalStyle;

        return [base, ext];
      }}
      {...props}>
      <Text
        style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 60,
  },
  inValid: {backgroundColor: colors.GRAY_100},

  // variant
  filled: {backgroundColor: colors.BLUE_400},
  outlined: {borderColor: colors.BLUE_400, borderWidth: 1},

  // pressed
  filledPressed: {backgroundColor: colors.WHITE},
  outlinedPressed: {borderColor: colors.WHITE, borderWidth: 1, opacity: 0.5},

  // size
  large: {
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  medium: {
    width: '50%',
    paddingVertical: deviceHeight > 700 ? 10 : 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    width: 72,
    height: 36,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // text
  text: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  largeText: {fontSize: 15, fontWeight: '500'},
  mediumText: {fontSize: 14, fontWeight: '500'},
  smallText: {fontSize: 14, fontWeight: '500'},
  filledText: {color: colors.WHITE},
  outlinedText: {color: colors.BLUE_400},
});
