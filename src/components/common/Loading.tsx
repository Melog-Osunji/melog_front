import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';

type Props = {
  size?: number;
  text?: string;
};

export default function LoadingIndicator({size = 64, text = ''}: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/common/loadingGif.gif')}
        style={[styles.image, {width: size, height: size}]}
        resizeMode="contain"
      />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 12,
  },
  text: {
    color: colors.GRAY_500,
    fontSize: 14,
  },
});
