import React from 'react';
import {StyleSheet, Dimensions, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants';

const SCREEN_W = Dimensions.get('window').width;

interface GradientBgProps {
  children: React.ReactNode;
  colors?: string[];
  start?: {x: number; y: number};
  end?: {x: number; y: number};
  style?: ViewStyle;
}

function GradientBg({
  children,
  colors: gradientColors = ['#EFFAFF', colors.WHITE],
  start = {x: 1, y: 0},
  end = {x: 1, y: 0.3},
  style,
}: GradientBgProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.container, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_W,
  },
});

export default GradientBg;
