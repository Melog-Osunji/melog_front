import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useHarmonyRoomContext} from '@/contexts/HarmonyRoomContext';
import SwitchToggle from '@/components/common/SwitchToggle';
import CheckPopup from '@/components/common/CheckPopup';
import DeleteReasonSheet from '@/components/harmonyRoom/DeleteReasonSheet';
import DeleteSuccessSheet from '@/components/harmonyRoom/DeleteSuccessSheet';
import {useDeleteHarmonyRoom} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
import {useUserInfo} from '@/hooks/common/useUserInfo';
import {useUpdateHarmonyRoom, useWaitingUserList} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
import {useHarmonyRoomInfo} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';

const DEVICE_WIDTH = Dimensions.get('window').width;
type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_SETTING'
>['route'];

function HarmonySettingScreen() {
  useHideTabBarOnFocus();

  const navigation =
    useNavigation<StackNavigationProp<HarmonyStackParamList>>();

  const route = useRoute<HarmonySettingRouteProp>();
  const {roomID} = route.params ?? {};
  const {rooms} = useHarmonyRoomContext();
  const deleteMut = useDeleteHarmonyRoom(roomID);
  const updateMutation = useUpdateHarmonyRoom(roomID);
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError,
  } = useHarmonyRoomInfo(roomID);
  const {
    data: waitingList,
    isLoading : isWaitingLoading,
    isError : waitingError,
  } = useWaitingUserList(roomID);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showReasonSheet, setShowReasonSheet] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const [isPublic, setIsPublic] = useState(true);
  const [needApproval, setNeedApproval] = useState(false);

  useEffect(() => {
    if (detail && !updateMutation.isSuccess) {
      setIsPublic(!detail.isPrivate);
      setNeedApproval(!detail.isDirectAssign);
    }
  }, [detail]);

  const handleGoToEdit = () => {
    navigation.navigate(harmonyNavigations.HARMONY_EDIT, {roomID: roomID});
  };

  const handleGoToApply = () => {
    navigation.navigate(harmonyNavigations.HARMONY_APPLY, {roomID: roomID});
  };

  const handleDelete = () => setShowExitPopup(true);

  // 1단계) 폐쇄하기 확인
  const handleConfirmExit = () => {
    setShowExitPopup(false);
    setShowReasonSheet(true);
  };
  const handleCancelExit = () => setShowExitPopup(false);

  // 2단계) 사유 선택 후 API 호출
  const handleSubmitReason = (reason: string) => {
    setShowReasonSheet(false);
    deleteMut.mutate(
      {reason},
      {
        onSuccess: () => {
          setShowSuccessSheet(true);
        },
        onError: (e: any) => {
          // 실패 토스트/알럿
          console.error(e);
        },
      },
    );
  };

  // 3단계) 완료 후 이동
  const handleFinish = () => {
    setShowSuccessSheet(false);
    navigation.navigate(harmonyNavigations.HARMONY_HOME as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/BackArrow.png')}
            target={'goBack'}
            size={24}
          />
          <Text style={styles.sectionTitle}>하모니룸 설정</Text>
        </View>
        <View style={styles.menuSection}>
          <Text style={styles.topMenu}>내 하모니룸</Text>
        </View>
        <Pressable style={styles.section} onPress={handleGoToEdit}>
          <Text style={styles.menu}>하모니룸 정보</Text>
          <Image
            source={require('@/assets/icons/mypage/RightArrow.png')}
            style={styles.iconBtn}
          />
        </Pressable>
        <View style={styles.toggleSection}>
          <View style={styles.toggleWrap}>
            <Text style={styles.menu}>하모니룸 공개</Text>
            <SwitchToggle
              value={isPublic}
              onValueChange={(value) => {
                  setIsPublic(value);
                  updateMutation.mutate(
                    { isPrivate: !value }, // 공개면 false, 비공개면 true
                    {
                      onSuccess: () => console.log('✅ 공개 여부 업데이트 완료'),
                      onError: (err) => console.error('❌ 공개 여부 업데이트 실패:', err),
                    },
                  );
                }}
              size="md"
            />
          </View>
          <Text style={styles.description}>
            하모니룸을 유저들에게 공개할 수 있어요.
          </Text>
        </View>
        <View style={styles.blank}></View>
        <View style={styles.menuSection}>
          <Text style={styles.topMenu}>하모니룸 관리</Text>
        </View>
        <View style={styles.toggleSection}>
          <View style={styles.toggleWrap}>
            <Text style={styles.menu}>운영자 승인 후 가입</Text>
            <SwitchToggle
              value={needApproval}
              onValueChange={(value) => {
                  setNeedApproval(value);
                  updateMutation.mutate(
                    { isDirectAssign: !value }, // 승인 필요 true → 자동 가입 false
                    {
                      onSuccess: () => console.log('✅ 승인 설정 업데이트 완료'),
                      onError: (err) => console.error('❌ 승인 설정 업데이트 실패:', err),
                    },
                  );
                }}
              size="md"
            />
          </View>
          <Text style={styles.description}>
            운영자가 승인해야 하모니룸에 가입할 수 있어요.
          </Text>
        </View>
        <Pressable style={styles.section} onPress={handleGoToApply}>
          <Text style={styles.menu}>가입 신청 관리</Text>
          <View style={styles.accessWrap}>
            <Text style={styles.accessNum}>+{String(waitingList.waitingUsers.length).padStart(2, '0')}</Text>
            <Image
              source={require('@/assets/icons/mypage/RightArrow.png')}
              style={styles.iconBtn}
            />
          </View>
        </Pressable>
        <Pressable style={styles.section}>
          <Text style={styles.menu}>회원 관리</Text>
          <Image
            source={require('@/assets/icons/mypage/RightArrow.png')}
            style={styles.iconBtn}
          />
        </Pressable>
        <Pressable style={styles.section}>
          <Text style={styles.menu}>차단 관리</Text>
          <Image
            source={require('@/assets/icons/mypage/RightArrow.png')}
            style={styles.iconBtn}
          />
        </Pressable>
        <View style={styles.blank}></View>
        <View style={styles.menuSection}>
          <Text style={styles.topMenu}>기타</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.menu}>하모니룸 폐쇄</Text>
          <Pressable onPress={handleDelete}>
            <Text style={styles.delete}>폐쇄하기</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 나가기 확인 팝업 */}
      <CheckPopup
        visible={showExitPopup}
        onClose={handleCancelExit}
        onExit={handleConfirmExit}
        iconImg={require('@/assets/icons/Error.png')}
        title="정말 이 하모니룸을 폐쇄하시겠어요?"
        content={`하모니룸 폐쇄 시, 쓰인 피드와 댓글이 삭제되고\n 복구하기 어려워요.`}
        leftBtnColor={colors.WHITE}
        leftBtnTextColor={colors.ERROR_RED}
        leftBtnBorderColor={colors.ERROR_RED}
        leftBtnText="폐쇄하기"
        rightBtnColor={colors.BLUE_400}
        rightBtnTextColor={colors.WHITE}
        rightBtnText="유지하기"
      />
      <DeleteReasonSheet
        visible={showReasonSheet}
        onClose={() => setShowReasonSheet(false)}
        onConfirm={handleSubmitReason}
      />
      <DeleteSuccessSheet visible={showSuccessSheet} onClose={handleFinish} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 58,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.GRAY_600,
  },
  blank: {
    height: 40,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  topMenu: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.BLACK,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'column',
    gap: 10,
  },
  menu: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.BLACK,
  },
  description: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.GRAY_400,
  },
  toggleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accessNum: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: colors.BLUE_200,
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.BLUE_500,
  },
  delete: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.RED_300,
  },
});

export default HarmonySettingScreen;
