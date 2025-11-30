import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import {settingsNavigations} from '@/constants';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';

import SettingHeader from '@/components/settings/SettingHeader';
import CustomButton from '@/components/common/CustomButton';
import BottomSheet from '@/components/common/BottomSheet';
import {colors} from '@/constants';
import {showToast} from '@/components/common/ToastService';
import {useAuthContext} from '@/contexts/AuthContext';
import {useResignUser} from '@/hooks/queries/User/useUserMutations';

type AccountDeleteScreenProps = StackScreenProps<
  SettingStackParamList,
  typeof settingsNavigations.ACCOUNT_DELETE
>;

export default function AccountDeleteScreen({
  navigation,
}: AccountDeleteScreenProps) {
  useHideTabBarOnFocus();

  const resignMutation = useResignUser();

  // 초기값을 null로 두어 사용자가 선택해야만 '다음' 활성화되게 함
  const [selected, setSelected] = React.useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [done, setDone] = React.useState(false); // 탈퇴 완료 상태
  const {resetAuthState} = useAuthContext();

  const isDeleting = resignMutation.isLoading;

  const options = [
    '기능이 복잡함',
    '원하는 정보를 찾기 어려움',
    '취향에 맞는 콘텐츠 부족',
    '잦은 오류 발생',
    '다른 유사 서비스 사용',
    '기타',
  ];

  const handleNext = () => {
    setSheetVisible(true);
  };

  const handleCancel = () => {
    setSheetVisible(false);
  };

  const handleDelete = () => {
    const reasonIndex = selected;
    const reason = options[selected ?? 0];
    console.log('탈퇴 처리:', {reasonIndex, reason});
    // 호출
    resignMutation.mutate(undefined, {
      onSuccess: () => {
        showToast('탈퇴가 완료되었습니다.', 'success');
        setSheetVisible(false);
        setDone(true);
      },
      onError: err => {
        console.error('resign error', err);
        showToast('탈퇴 처리 중 오류가 발생했습니다.', 'error');
      },
    });
  };

  // 완료 후 홈으로 이동
  const handleGoHome = () => {
    // resetAuthState가 제공되지 않을 수 있으므로 안전 호출
    resetAuthState?.();
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <SettingHeader title="탈퇴하기" />

      {!done ? (
        <>
          <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.title}>떠나시는 이유를 {'\n'}알려주세요.</Text>

            <View style={styles.list}>
              {options.map((label, idx) => {
                const active = selected === idx;
                return (
                  <TouchableOpacity
                    key={label}
                    activeOpacity={0.8}
                    style={styles.item}
                    onPress={() => setSelected(idx)}>
                    <Text style={styles.itemText}>{label}</Text>
                    <Image
                      source={
                        active
                          ? require('@/assets/icons/common/Radio_activate.png')
                          : require('@/assets/icons/common/Radio.png')
                      }
                      style={styles.radio}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              label="다음"
              onPress={handleNext}
              inValid={selected === null}
              size="large"
              variantColor={colors.BLUE_500}
            />
          </View>

          <BottomSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            height="45%">
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>탈퇴 전 확인해 주세요.</Text>

              <View style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                  1. 탈퇴한 고객님의 정보는 즉시 파기됩니다.{'\n'}
                  2. 탈퇴 후 재가입 시 이용내역 복구는 불가합니다.{'\n'}
                  3. 탈퇴 후 동일 계정으로 재가입 시 제한을 받을 수 있습니다.
                </Text>
              </View>

              <Text style={styles.confirmText}>정말로 탈퇴하시겠습니까?</Text>

              <View style={styles.sheetButtons}>
                <CustomButton
                  label="취소"
                  onPress={handleCancel}
                  variant="outlined"
                  variantColor={colors.GRAY_300}
                  style={{flex: 1, marginRight: 8}}
                />
                <CustomButton
                  label={isDeleting ? '처리 중...' : '탈퇴하기'}
                  onPress={handleDelete}
                  variant="outlined"
                  variantColor={colors.RED_300}
                  style={{flex: 1}}
                  disabled={isDeleting}
                />
              </View>
            </View>
          </BottomSheet>
        </>
      ) : (
        // 탈퇴 완료
        <View style={styles.doneContainer}>
          <View style={styles.center}>
            <Image
              source={require('@/assets/icons/common/check_circle.png')}
              style={styles.checkImg}
            />

            <Text style={styles.doneTitle}>탈퇴가 완료되었어요.</Text>
            <Text style={styles.doneSubtitle}>
              그동안 Melog를 이용해 주셔서{'\n'}감사드립니다.
            </Text>
          </View>

          <View style={styles.doneFooter}>
            <CustomButton
              label="홈으로 이동"
              onPress={handleGoHome}
              size="large"
              variantColor={colors.BLUE_500}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#fff'},
  body: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.BLACK,
    marginBottom: 24,
    lineHeight: 32,
  },
  list: {
    backgroundColor: 'transparent',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  radio: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#fff',
  },

  // bottom sheet styles
  sheetContent: {
    padding: 20,
    flex: 1,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.BLACK,
  },
  noticeBox: {
    backgroundColor: colors.GRAY_100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  noticeText: {
    color: colors.GRAY_500,
    lineHeight: 24,
    fontSize: 12,
  },
  confirmText: {
    fontSize: 14,
    color: colors.GRAY_600,
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // done screen styles
  doneContainer: {flex: 1, justifyContent: 'space-between'},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  checkImg: {
    width: 30,
    height: 30,
    tintColor: colors.BLACK,
    resizeMode: 'contain',
  },
  doneTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.BLACK,
    marginBottom: 8,
  },
  doneSubtitle: {
    fontSize: 14,
    color: colors.GRAY_600,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneFooter: {padding: 20, paddingBottom: 30},
});
