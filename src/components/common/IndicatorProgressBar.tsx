import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants';

type Props = { step: number; total: number };

export default function IndicatorProgressBar({step, total}:Props) {
    const width = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const ratio = Math.max(0, Math.min(1, step / total));
        Animated.timing(width, { toValue: ratio, duration: 250, useNativeDriver: false }).start();
    }, [step, total, width]);

    const interpolated = width.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: interpolated }]} />
        </View>
    );
}


const styles = StyleSheet.create({
  track: { height: 4, backgroundColor: colors.GRAY_100, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.BLUE_400 },
});