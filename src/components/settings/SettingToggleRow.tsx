import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import IconButton from '@/components/common/IconButton';
import SwitchToggle from '@/components/common/SwitchToggle';

type Props = {
  label: string;
  info?: React.ReactNode | string;
  onPress?: () => void;
};

export default function SettingRow({label, info, onPress}: Props) {
  const [isPublic, setIsPublic] = React.useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.right}>
          <SwitchToggle
            value={isPublic}
            onValueChange={() =>
              isPublic ? setIsPublic(false) : setIsPublic(true)
            }
            size="md"
          />
        </View>
      </View>

      {info && typeof info === 'string' ? (
        <Text style={styles.infoText}>{info}</Text>
      ) : (
        info
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {flex: 1},
  right: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 11},
  label: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});
