import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  PressableProps,
  Dimensions,
  View,
} from 'react-native';

import {colors} from '@/constants';

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium' | 'small';
  inValid?: boolean;
  onPress?: () => void;
}

const deviceHeight = Dimensions.get('screen').height;

function CustomButton({
  label,
  variant = 'filled',
  size = 'large',
  inValid = false,
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      disabled={inValid}
      style={({pressed}) => [
        styles.container,
        styles[size],
        pressed ? styles[`${variant}Pressed`] : styles[variant],
        inValid && styles.inValid,
      ]}
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
  inValid: {
    opacity: 0.5,
  },
  filled: {
    backgroundColor: colors.BLUE_400,
  },
  outlined: {
    borderColor: colors.BLUE_400,
    borderWidth: 1,
  },

  filledPressed: {
    backgroundColor: colors.WHITE,
  },
  outlinedPressed: {
    borderColor: colors.WHITE,
    borderWidth: 1,
    opacity: 0.5,
  },

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
  text: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  largeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  mediumText: {
    fontSize: 14,

    fontWeight: '500',
  },
  smallText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filledText: {
    color: colors.WHITE,
  },
  outlinedText: {
    color: colors.BLUE_400,
  },
});

export default CustomButton;
