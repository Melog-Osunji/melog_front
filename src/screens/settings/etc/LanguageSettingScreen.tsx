import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SettingHeader from '@/components/settings/SettingHeader';
import IconButton from '@/components/common/IconButton';
import {colors} from '@/constants';

export default function LanguageSettingScreen() {
  return (
    <View style={styles.screen}>
      <SettingHeader title={'언어 설정'} />
      <View style={styles.body}>
        <View style={styles.container}>
          <Text style={styles.text}>한국어</Text>
          <IconButton
            imageSource={require('@/assets/icons/intro/checkbox.png')}
            pressedImageSource={require('@/assets/icons/intro/checkbox_activate.png')}
            isPressed={true}
            size={24}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#fff'},
  body: {flex: 1, alignItems: 'center', padding: 20},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {color: colors.BLACK, colorsfontSize: 24, fontWeight: 'bold'},
});
