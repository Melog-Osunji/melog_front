// src/components/harmony/DeleteReasonSheet.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, TextInput, Platform, Animated,
} from 'react-native';
import { colors } from '@/constants';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const DEFAULT_REASONS = [
  '멤버의 참여율이 낮아서',
  '관심 주제가 변경되어서',
  '기술적인 문제 때문에',
  '시간 부족 등 개인적인 이유',
  '기타',
];

const DeleteReasonSheet: React.FC<Props> = ({ visible, onClose, onConfirm }) => {
  const [selected, setSelected] = useState<string>(DEFAULT_REASONS[0]);
  const [etcText, setEtcText] = useState('');
  const [y] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setSelected(DEFAULT_REASONS[0]);
      setEtcText('');
      Animated.timing(y, { toValue: 1, duration: 200, useNativeDriver: true });
    } else {
      y.setValue(0);
    }
  }, [visible]);

  const translateY = y.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  const finalReason =
    selected === '기타' ? (etcText.trim() || '기타') : selected;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>이 하모니룸을 폐쇄하려는 이유를 알려주세요.</Text>
          <Text style={styles.sub}>운영자님의 소중한 피드백은 앞으로 더 좋은 서비스를 만드는 데 큰 도움이 됩니다.</Text>

          <View style={{ marginTop: 12 }}>
            {DEFAULT_REASONS.map((r) => {
              const checked = selected === r;
              return (
                <Pressable
                  key={r}
                  style={styles.row}
                  onPress={() => setSelected(r)}
                >
                  <Text style={styles.reason}>{r}</Text>
                  <View style={[styles.radio, checked && styles.radioChecked]}>
                    {checked && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {selected === '기타' && (
            <TextInput
              placeholder="사유를 입력해주세요."
              placeholderTextColor={colors.GRAY_300}
              value={etcText}
              onChangeText={setEtcText}
              style={styles.input}
              maxLength={100}
              multiline
            />
          )}

          <View style={styles.btnRow}>
            <Pressable style={[styles.btn, styles.btnGray]} onPress={onClose}>
              <Text style={[styles.btnText, { color: colors.GRAY_500 }]}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnDanger]}
              onPress={() => onConfirm(finalReason)}
            >
              <Text style={[styles.btnText, { color: colors.ERROR_RED }]}>폐쇄하기</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.WHITE, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8,
  },
  handle: {
    alignSelf: 'center', width: 44, height: 4, borderRadius: 999, backgroundColor: colors.GRAY_200, marginVertical: 8,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.BLACK },
  sub: { marginTop: 6, fontSize: 12, lineHeight: 16, color: colors.GRAY_400 },
  row: {
    paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.GRAY_150,
  },
  reason: { fontSize: 14, color: colors.BLACK },
  radio: {
    width: 20, height: 20, borderRadius: 999, borderWidth: 2, borderColor: colors.GRAY_300, alignItems: 'center', justifyContent: 'center',
  },
  radioChecked: { borderColor: colors.BLUE_400 },
  radioDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: colors.BLUE_400 },
  input: {
    marginTop: 12, backgroundColor: colors.GRAY_100, borderRadius: 8, padding: 12,
    textAlignVertical: 'top', minHeight: 80, color: colors.BLACK, fontSize: 14,
  },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: Platform.OS === 'ios' ? 20 : 8 },
  btn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  btnGray: { backgroundColor: colors.GRAY_100, borderColor: colors.GRAY_200 },
  btnDanger: { backgroundColor: colors.WHITE, borderColor: colors.ERROR_RED },
  btnText: { fontSize: 14, fontWeight: '600' },
});

export default DeleteReasonSheet;
