// src/components/harmony/DeleteSuccessSheet.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants';
import BottomSheet from '@/components/common/BottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const DeleteSuccessSheet: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <BottomSheet visible={visible} onClose={onClose} height="32%">
      <View style={styles.container}>
        {/* ✅ 상단 핸들바는 BottomSheet 내부에 이미 있음 */}

        {/* 체크 아이콘 */}
        <View style={styles.iconWrap}>
          <Image
            source={require('@/assets/icons/common/check_circle.png')}
            style={styles.icon}
          />
        </View>

        {/* 텍스트 */}
        <Text style={styles.title}>하모니룸을 폐쇄했어요.</Text>
        <Text style={styles.sub}>피드백을 주셔서 감사합니다.</Text>

        {/* 버튼 */}
        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    flex: 1,
  },
  iconWrap: {
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.GRAY_300,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.BLACK,
    lineHeight:22,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.GRAY_500,
    lineHeight:20,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginTop:12,
  },
  button: {
    marginTop: 33,
    width: '100%',
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.BLUE_500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.WHITE,
    lineHeight:22,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
});

export default DeleteSuccessSheet;
