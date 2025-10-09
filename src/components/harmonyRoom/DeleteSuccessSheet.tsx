// src/components/harmony/DeleteSuccessSheet.tsx
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const DeleteSuccessSheet: React.FC<Props> = ({ visible, onClose }) => {
  const [y] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) Animated.timing(y, { toValue: 1, duration: 200, useNativeDriver: true });
    else y.setValue(0);
  }, [visible]);

  const translateY = y.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>하모니룸을 폐쇄했어요.</Text>
          <Text style={styles.sub}>피드백을 주셔서 감사합니다.</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>완료</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.WHITE, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8,
  },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 999, backgroundColor: colors.GRAY_200, marginVertical: 8 },
  title: { fontSize: 16, fontWeight: '700', color: colors.BLACK, marginTop: 4 },
  sub: { marginTop: 6, fontSize: 12, lineHeight: 16, color: colors.GRAY_400 },
  button: {
    marginTop: 16, height: 44, borderRadius: 10, backgroundColor: colors.BLUE_400,
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { color: colors.WHITE, fontSize: 14, fontWeight: '700' },
});

export default DeleteSuccessSheet;
