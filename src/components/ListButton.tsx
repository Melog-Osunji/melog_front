import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  PressableProps,
} from 'react-native';
import {colors} from '@/constants';

interface ListButtonProps extends PressableProps {
  label: string;
}

const ListButton = ({label, ...props}: ListButtonProps) => {
  return (
    <Pressable style={styles.container} {...props}>
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
        <Image
          source={require('@/assets/icons/harmonyRoom/ListArrow.png')}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 10,
    marginBottom: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.GRAY_500,
    lineHeight: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ListButton;
