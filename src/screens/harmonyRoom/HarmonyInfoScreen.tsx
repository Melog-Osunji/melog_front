import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {colors, harmonyNavigations, postNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHarmonyRoomContext} from '@/contexts/HarmonyRoomContext';
import GuideModal from '@/components/harmonyRoom/GuideModal';
import LinearGradient from 'react-native-linear-gradient';
import EmptyTab from '@/components/search/EmptyTab';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import CustomButton from '@/components/common/CustomButton';
import CheckPopupOneBtn from '@/components/common/CheckPopupOneBtn';
import CheckPopup from '@/components/common/CheckPopup';
import {
  useHarmonyRoomDetailInfo,
  useHarmonyIsMember,
  useHarmonyRoomInfo,
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
import {
  useRequestJoinHarmonyRoom,
  useLeaveHarmonyRoom,
  useBookmarkHarmonyRoom,
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshControl} from 'react-native';

const {width: SCREEN_W} = Dimensions.get('window');

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

export default function HarmonyInfoScreen() {
  useHideTabBarOnFocus();

  const route = useRoute<HarmonyPageScreenRouteProp>();
  const {roomID} = route.params;
  const {rooms} = useHarmonyRoomContext();
  const [selectTab, setSelectTab] = useState<'rcmd' | 'popular'>('rcmd');

  // hook들
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useHarmonyRoomDetailInfo(roomID);
  const {mutateAsync: requestJoin, isPending: joinLoading} =
    useRequestJoinHarmonyRoom(roomID);
  const {mutateAsync: leaveRoom, isPending: leaveLoading} =
    useLeaveHarmonyRoom(roomID);
  const {mutateAsync: toggleBookmark, isPending: bookmarkLoading} =
    useBookmarkHarmonyRoom();

  const [fav, setFav] = useState<boolean>(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showOutPopup, setShowOutPopup] = useState(false);
  // 상태: 가입 상태(버튼 문구/노출 제어), 팝업 모드
  const [joinStatus, setJoinStatus] = useState<'none' | 'pending' | 'joined'>(
    'none',
  );
  const [popupMode, setPopupMode] = useState<'joined' | 'applied'>('joined');

  // 변수
  const headerImg = detail?.profileImgLink ?? '';
  const headerName = detail?.name ?? '하모니룸';
  const headerTags = detail?.category ?? [];
  const headerIntro = detail?.intro ?? '';
  const memberNum = detail?.memberNum ?? 0;
  const ranking = detail?.ranking ?? 0;
  const countPosts = detail?.countPosts ?? 0;

  React.useEffect(() => {
    if (detail) setFav(!!detail.isBookmark);
  }, [detail]);

  React.useEffect(() => {
    if (isMemberDTO?.isMember) setJoinStatus('joined');
    else setJoinStatus('none'); // 서버에 대기중 플래그가 없으면 로컬로만 관리
  }, [isMemberDTO]);

  useFocusEffect(
    useCallback(() => {
      refetch(); // detail
    }, [refetch]),
  );

  const currentUserId = 'f4c475f1-9016-4b01-91a8-1880cf749903';

  const {data: isMemberDTO} = useHarmonyIsMember(roomID);
  const isMember = isMemberDTO?.isMember ?? false;
  const effectiveIsMember = isMember || joinStatus === 'joined';
  const {data: roomInfo} = useHarmonyRoomInfo(roomID);
  const isOwner = roomInfo ? roomInfo.owner === currentUserId : false;

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleAccess = async () => {
    if (!detail) return;
    try {
      await requestJoin(); // API는 하나만: 백엔드가 isDirectAssign로 처리
      if (detail.isDirectAssign) {
        setJoinStatus('joined');
        setPopupMode('joined'); // "가입 완료"
      } else {
        setJoinStatus('pending');
        setPopupMode('applied'); // "가입 신청 완료"
      }
      setShowExitPopup(true);
    } catch (e) {
      console.warn(e);
      // 필요시 토스트/알럿 추가
    }
  };

  const handleConfirmExit = () => setShowExitPopup(false);
  const handleOut = () => setShowOutPopup(true);
  const handleCancelExit = () => setShowOutPopup(false);
  const handleOutAccess = async () => {
    try {
      await leaveRoom(); // 서버에서 나가기 처리
      setShowOutPopup(false); // 팝업 닫기
      setJoinStatus('none'); // 로컬 상태도 비회원으로
      navigation.navigate(harmonyNavigations.HARMONY_HOME);
    } catch (e) {
      console.warn(e);
    }
  };
  const handleToggleFav = async () => {
    // 이미 처리 중이면 중복 클릭 방지
    if (bookmarkLoading) return;
    const prev = fav;
    setFav(!prev); // 옵티미스틱 업데이트
    try {
      await toggleBookmark(roomID); // 서버 토글
    } catch (e) {
      setFav(prev); // 실패 시 롤백
      console.warn(e);
    }
  };

  if (isLoading && !detail) {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: '#c22'}}>하모니룸 정보를 불러오지 못했어요.</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#EFFAFF', colors.WHITE]} // 원하는 색 배열
      start={{x: 1, y: 0}}
      end={{x: 1, y: 0.3}}
      style={styles.container}>
      <SafeAreaView style={{flex: 1, width: SCREEN_W}}>
        {/* 헤더 */}
        <View style={styles.header}>
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/BackArrow.png')}
            target={'goBack'}
            size={24}
            imageStyle={{tintColor: colors.GRAY_300}}
          />
          {isOwner ? (
            <IconButton<MyPageStackParamList>
              imageSource={require('@/assets/icons/harmonyRoom/Setting.png')}
              target={[harmonyNavigations.HARMONY_SETTING, {roomID}]}
            />
          ) : (
            <View style={{width: 24, height: 24}} />
          )}
        </View>

        {/* 하모니룸 */}
        <View style={styles.infoWrap}>
          <View style={styles.nameAndTag}>
            {headerImg ? (
              <Image source={{uri: headerImg}} style={styles.roomImg} />
            ) : (
              <View
                style={[styles.roomImg, {backgroundColor: colors.GRAY_300}]}
              />
            )}
            <View style={styles.roomInfo}>
              <View style={styles.nameWrap}>
                <Text style={styles.name}>{headerName}</Text>
                {isOwner ? <Text style={styles.manageLabel}>운영</Text> : null}
              </View>
              {!!headerTags.length && (
                <View style={styles.tagWrap}>
                  {headerTags.slice(0, 3).map((t, idx) => (
                    <Text key={`${t}_${idx}`} style={styles.tags}>
                      #{t}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
          {!!headerIntro && (
            <View style={styles.descriptionWrap}>
              <Text style={styles.description}>{headerIntro}</Text>
            </View>
          )}
        </View>

        {/* 멤버 정보 */}
        <View style={styles.memAndRankWrap}>
          <View style={styles.memAndRank}>
            <View style={styles.section}>
              <Text style={styles.title}>멤버</Text>
              <Text style={styles.content}>{memberNum}명</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>랭킹</Text>
              <Text style={styles.content}>{ranking}위</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>누적 피드</Text>
              <Text style={styles.content}>{countPosts}개</Text>
            </View>
          </View>
        </View>

        {/* 버튼 */}
        <View style={styles.btnWrap}>
          <Pressable
            style={[styles.btn, bookmarkLoading && {opacity: 0.6}]}
            onPress={handleToggleFav}
            disabled={bookmarkLoading}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Image
              source={
                fav
                  ? require('@/assets/icons/harmonyRoom/FavoriteColor.png')
                  : require('@/assets/icons/harmonyRoom/Favorite.png')
              }
              style={[styles.iconImg, !fav && {tintColor: colors.GRAY_400}]}
            />
            <Text style={styles.btnText}>
              {fav ? '즐겨찾기 해제' : '즐겨찾기'}
            </Text>
          </Pressable>
          <View style={styles.btn}>
            <Text style={styles.btnText}>공유</Text>
          </View>
        </View>

        {/* 나가기 */}
        {isMember && (
          <View style={styles.outWrap}>
            <Pressable onPress={handleOut}>
              <Text style={styles.outText}>하모니룸 나가기</Text>
            </Pressable>
          </View>
        )}

        {/* 고정된 버튼 */}
        {!effectiveIsMember && !isOwner && (
          <View style={styles.bottom}>
            <CustomButton
              label={joinStatus === 'pending' ? '가입 진행중' : '가입하기'}
              onPress={handleAccess}
              disabled={joinStatus === 'pending' || joinLoading}
              style={[
                {backgroundColor: colors.BLUE_500},
                (joinStatus === 'pending' || joinLoading) && {opacity: 0.6},
              ]}
            />
          </View>
        )}

        <CheckPopupOneBtn
          visible={showExitPopup}
          onClose={() => setShowExitPopup(false)}
          iconImg={require('@/assets/icons/Access.png')}
          title={popupMode === 'joined' ? '가입 완료' : '가입 신청 완료'}
          content={
            popupMode === 'joined'
              ? '하모니룸에 가입되었어요.'
              : '승인되면 알림으로 알려드릴게요.'
          }
          btnColor={colors.BLUE_400}
          btnText="확인"
          btnTextColor={colors.WHITE}
        />

        {/* 나가기 확인 팝업 */}
        <CheckPopup
          visible={showOutPopup}
          onClose={handleCancelExit}
          onExit={handleOutAccess}
          title="이 하모니룸에서 나갈까요?"
          content="나가시면 다시 가입 신청을 해야 해요."
          leftBtnColor={colors.WHITE}
          leftBtnTextColor={colors.ERROR_RED}
          leftBtnBorderColor={colors.ERROR_RED}
          leftBtnText="나가기"
          rightBtnColor={colors.BLUE_400}
          rightBtnTextColor={colors.WHITE}
          rightBtnText="머무르기"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LINE_GREY,
  },
  infoWrap: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 24,
  },
  nameAndTag: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  roomImg: {
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: colors.GRAY_500,
  },
  roomInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
  },
  manageLabel: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.BLUE_300,
    color: colors.BLUE_500,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  tagWrap: {
    flexDirection: 'row',
    gap: 9,
  },
  tags: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.BLUE_600,
  },
  descriptionWrap: {
    borderRadius: 16,
    backgroundColor: colors.BLUE_200,
    padding: 16,
  },
  description: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.BLUE_700,
  },
  memAndRankWrap: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  memAndRank: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.LINE_GREY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 61,
    paddingHorizontal: 52,
    paddingVertical: 15,
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 11,
  },
  title: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.BLACK,
  },
  content: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.GRAY_500,
  },
  btnWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    minWidth: 86,
  },
  iconImg: {
    width: 18,
    height: 18,
  },
  btnText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.GRAY_600,
  },
  bottom: {
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 'auto',
    paddingTop: 6,
  },
  outWrap: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.35,
    lineHeight: 14,
    color: colors.GRAY_300,
  },
});
