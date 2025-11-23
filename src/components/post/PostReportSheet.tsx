import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  GestureResponderEvent,
} from 'react-native';
import BottomSheet from '@/components/common/BottomSheet';
import {colors} from '@/constants';

type Props = {
  visible: boolean;
  onClose: () => void;
  onReport?: (reason: string) => void;
};

const REASONS = [
  '욕설 및 비방',
  '클래식과 무관한 내용',
  '스팸 또는 광고',
  '혐오감이 드는 내용',
  '기타',
];

export default function PostReportSheet({visible, onClose, onReport}: Props) {
  const [step, setStep] = useState<'select' | 'done'>('select');
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (reason: string) => {
    setSelected(reason);
    // 바로 접수화면 보여주기
    setStep('done');
    // 실제 신고 API 호출은 onReport로 위임
    try {
      onReport?.(reason);
    } catch (e) {
      console.warn('[PostReportSheet] onReport error', e);
    }
  };

  const handleDone = (e?: GestureResponderEvent) => {
    setSelected(null);
    setStep('select');
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      height={step === 'done' ? '30%' : '48%'} // 변경: 완료 화면에서는 30%
    >
      <View style={styles.container}>
        {step === 'select' ? (
          <>
            <Text style={styles.headerTitle}>
              이 댓글을 신고하는 이유를 알려주세요.
            </Text>

            {REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                style={styles.row}
                onPress={() => handleSelect(reason)}
                activeOpacity={0.7}>
                <Text style={styles.label}>{reason}</Text>
                <Image
                  source={require('@/assets/icons/common/RightArrow.png')}
                  style={styles.arrow}
                />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          // 완료 화면
          <View style={styles.doneWrap}>
            <Image
              source={require('@/assets/icons/common/check_circle.png')}
              style={styles.doneIcon}
            />
            <Text style={styles.doneTitle}>신고가 접수되었어요.</Text>
            <Text style={styles.doneText}>
              보내주신 내용은 검토를 위해 관리자에게 전달됩니다.
            </Text>

            <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneBtnText}>완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.GRAY_600,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY_100,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: '600',
  },
  arrow: {
    width: 18,
    height: 18,
    tintColor: colors.GRAY_300,
  },

  // done screen
  doneWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  doneIcon: {
    width: 20,
    height: 20,
    tintColor: colors.GRAY_300,
  },
  doneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.BLACK,
    marginBottom: 8,
  },
  doneText: {
    fontSize: 14,
    color: colors.GRAY_500,
    textAlign: 'center',
    marginBottom: 20,
  },
  doneBtn: {
    width: '100%',
    borderRadius: 60,
    backgroundColor: colors.BLUE_500,
    paddingHorizontal: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
