import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from '@/components/common/IconButton';

type Props = {
  label: string;
  info?: React.ReactNode | string;
  onPress?: () => void;
};

export default function SettingRow({label, info, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        {info && typeof info === 'string' ? (
          <Text style={styles.infoText}>{info}</Text>
        ) : (
          info
        )}
        <Icon
          imageSource={require('@/assets/icons/common/arrow_forward_ios.png')}
          size={24}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  left: {flex: 1},
  right: {flexDirection: 'row', alignItems: 'center', gap: 8},
  label: {fontSize: 14, color: '#222', fontWeight: 'bold'},
  infoText: {fontSize: 14, color: '#888', marginRight: 8},
});
