import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import IconButton from '@/components/common/IconButton';

export default function NoticesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
        <Text style={styles.title}>NoticesScreen</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>NoticesScreen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#fff'},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    gap: 12,
  },
  title: {fontSize: 18, fontWeight: '600'},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {fontSize: 18},
});
