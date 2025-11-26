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
import {useReportPost} from '@/hooks/queries/post/usePostMutations';
import {showToast} from '@/components/common/ToastService';
import {useAuthContext} from '@/contexts/AuthContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onReport?: (reason: string) => void;
  postId?: string | null;
  commentId?: string | null;
  reportedUserId?: string | null;
};

// label과 서버로 보낼 enum string(value)을 함께 정의
const REASONS: {label: string; value: string}[] = [
  {label: '부적절한 내용', value: 'INAPPROPRIATE_CONTENT'},
  {label: '서비스와 관련없는 내용', value: 'IRRELEVANT_TO_SERVICE'},
  {label: '스팸 또는 광고', value: 'SPAM_OR_ADVERTISEMENT'},
  {label: '저작권 또는 상표권 침해', value: 'COPYRIGHT_OR_TRADEMARK'},
  {label: '혐오감이 드는 내용', value: 'OFFENSIVE_CONTENT'},
  {label: '기타', value: 'OTHER'},
];

export default function PostReportSheet({
  visible,
  onClose,
  onReport,
  postId = null,
  commentId = null,
  reportedUserId = null,
}: Props) {
  const [step, setStep] = useState<'select' | 'done'>('select');
  const [selected, setSelected] = useState<string | null>(null);
  const {mutate: reportMutate, isLoading: isReporting} = useReportPost();
  const {user: authUser} = useAuthContext();

  const handleSelect = (reasonValue: string, reasonLabel: string) => {
    setSelected(reasonValue);
    // 호출
    reportMutate(
      {
        userID: authUser?.id ?? null,
        reason: reasonValue,
        postId: postId ?? null,
        commentId: commentId ?? null,
        reportedUserId: reportedUserId ?? null,
      },
      {
        onSuccess: () => {
          setStep('done');
          showToast('신고가 접수되었습니다.', 'success');
          onReport?.(reasonValue);
        },
        onError: err => {
          console.warn('[PostReportSheet] report error', err);
          showToast('신고 처리에 실패했습니다.', 'error');
        },
      },
    );
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
      height={step === 'done' ? '30%' : '55%'}>
      <View style={styles.container}>
        {step === 'select' ? (
          <>
            <Text style={styles.headerTitle}>
              이 게시글을 신고하는 이유를 알려주세요.
            </Text>

            {REASONS.map(({label, value}) => (
              <TouchableOpacity
                key={value}
                style={styles.row}
                onPress={() => handleSelect(value, label)}
                activeOpacity={0.7}
                disabled={isReporting}>
                <Text style={styles.label}>{label}</Text>
                <Image
                  source={require('@/assets/icons/common/RightArrow.png')}
                  style={styles.arrow}
                />
              </TouchableOpacity>
            ))}
          </>
        ) : (
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
