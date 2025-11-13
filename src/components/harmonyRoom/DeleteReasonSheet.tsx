// src/components/harmony/DeleteReasonSheet.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '@/constants';
import BottomSheet from '@/components/common/BottomSheet';

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

  useEffect(() => {
    if (visible) {
      setSelected(DEFAULT_REASONS[0]);
      setEtcText('');
    }
  }, [visible]);

  const finalReason =
    selected === '기타' ? (etcText.trim() || '기타') : selected;

  return (
    <BottomSheet visible={visible} onClose={onClose} height="55%">
      <ScrollView
        style={{ flexGrow: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sheetContainer}>
        <View style={styles.textWrap}>
            <Text style={styles.title}>이 하모니룸을 폐쇄하려는 이유를 알려주세요.</Text>
            <Text style={styles.sub}>
              {`운영자님의 소중한 피드백은 앞으로 더 좋은 서비스를\n만드는 데 큰 도움이 됩니다.`}
            </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          {DEFAULT_REASONS.map((r) => {
            const checked = selected === r;
            return (
              <Pressable
                key={r}
                style={styles.row}
                onPress={() => setSelected(r)}>
                <Text style={styles.reason}>{r}</Text>
                <View style={[styles.radio, checked && styles.radioChecked]}>
                  {checked && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>
{/**
        {selected === '기타' && (
          <TextInput
            placeholder="사유를 입력해주세요."
            placeholderTextColor={colors.GRAY_300}
            value={etcText}
            onChangeText={setEtcText}
            style={styles.input}
            maxLength={50}
            multiline
          />
        )}
*/}
        <View style={styles.btnRow}>
          <Pressable style={[styles.btn, styles.btnGray]} onPress={onClose}>
            <Text style={styles.btnText}>취소</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnDanger]}
            onPress={() => onConfirm(finalReason)}>
            <Text style={[styles.btnText, { color: colors.ERROR_RED }]}>폐쇄하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: 20,
  },
  textWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical:16,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.BLACK,
    lineHeight:22,
    letterSpacing: 0.15,
  },
  sub: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_400,
    lineHeight:16,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  row: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reason: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.BLACK,
    lineHeight:20,
    letterSpacing: 0.2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.GRAY_300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.BLUE_400,
  },
  input: {
    marginTop: 12,
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 64,
    color: colors.BLACK,
    fontSize: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical:12,
  },
  btnGray: {
    backgroundColor: colors.GRAY_100,
    borderColor: colors.GRAY_100,
  },
  btnDanger: {
    backgroundColor: colors.WHITE,
    borderColor: colors.ERROR_RED,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight:22,
    letterSpacing: 0.15,
    color: colors.GRAY_300,
  },
});

export default DeleteReasonSheet;
