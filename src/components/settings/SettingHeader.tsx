import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IconButton from '@/components/common/IconButton';
import {colors} from '@/constants';

type SettingHeaderProps = {
  title?: string;
};

export default function SettingHeader({title = ' title'}: SettingHeaderProps) {
  return (
    <View style={styles.header}>
      <IconButton
        imageSource={require('@/assets/icons/post/BackArrow.png')}
        target={'goBack'}
        size={24}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
    backgroundColor: colors.WHITE,
  },
  title: {
    fontSize: 18,
    color: colors.BLACK,
    fontWeight: '700',
  },
});
