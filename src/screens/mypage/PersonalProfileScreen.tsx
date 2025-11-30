import React, {useState, useMemo, useCallback} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, RefreshControl, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {MyPageStackParamList} from '@/navigations/stack/MyPageStackNavigator';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {colors, myPageNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import MyPageFeedTab from '@/components/mypage/MyPageFeedTab';
import MyPageMediaTab from '@/components/mypage/MyPageMediaTab';
import MyPageBookmarkTab from '@/components/mypage/MyPageBookmarkTab';
import HarmonyRoomStrip, { type Community } from '@/components/harmonyRoom/HarmonyRoomStrip';
import { useMyPage } from '@/hooks/queries/myPage/useMyPage'
import {useUserInfo} from '@/hooks/common/useUserInfo';
import { StackScreenProps } from '@react-navigation/stack';
import { useGetUserFollowing } from '@/hooks/queries/User/useUserQueries';
import { useFollowUser } from '@/hooks/queries/User/useUserMutations';

type HarmonyPersonalProps = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PERSONAL'
>;

type MyPagePersonalProps = StackScreenProps<
  MyPageStackParamList,
  'MYPAGE_PROFILE'
>;

type PersonalProfileScreenProps = HarmonyPersonalProps | MyPagePersonalProps;

const {width: SCREEN_W} = Dimensions.get('window');

function PersonalProfileScreen({ route }: PersonalProfileScreenProps) {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();

  const { userId } = route.params;

  const [selectedTab, setSelectedTab] = useState<
      'feed' | 'media' | 'bookmarkFeed'
    >('feed');

  // api 변경
  const { data, isLoading, isError, refetch, isRefetching } = useMyPage(userId);

  // 팔로잉 확인
  const {
    data: followingData,
    isLoading: isFollowingLoading,
    refetch: refetchFollowing,
  } = useGetUserFollowing(userId ?? '');

  const followMutation = useFollowUser();

  const isFollowing = followingData?.result === true;

  const onPressFollow = () => {
    if (!data?.nickname) return;

    followMutation.mutate(userId, {
      onSuccess: () => {
        refetchFollowing();  // 버튼 상태 업데이트
        refetch();           // 마이페이지 숫자(팔로워/팔로잉) 갱신
      },
    });
  };



  const communities = useMemo<Community[]>(() => {
      if (!data?.harmonyRooms) return [];
      return data.harmonyRooms.map(room => ({
        id: String(room.roomId),
        name: room.roomName,
        coverUri: room.roomImg,
        isOwner: room.manager,
        isFavorite: room.bookmark,
      }));
    }, [data]);

  const feedCount = data?.posts?.results.length ?? 0;

  if (isLoading) {
      return (
        <SafeAreaView style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
          <ActivityIndicator />
          <Text style={{marginTop:8, color:colors.GRAY_500}}>불러오는 중…</Text>
        </SafeAreaView>
      );
    }

  return (
    <LinearGradient
          colors={['#EFFAFF', colors.WHITE]} // 원하는 색 배열
          start={{x: 1, y: 0}}
          end={{x: 1, y: 0.3}}
          style={styles.container}
        >
          <SafeAreaView style={styles.content}
          refreshControl={
               <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.BLUE_500} />
             }>
            {/* 헤더 */}
            <View style={styles.header}>
                <IconButton
                    imageSource={require('@/assets/icons/post/BackArrow.png')}
                    target={'goBack'}
                    size={24}
                    imageStyle={{ tintColor: colors.GRAY_300 }}
                />
                <View style={styles.rightButtons}>
                    <IconButton<MyPageStackParamList>
                        imageSource={require('@/assets/icons/post/Notice.png')}
    //                     target={[myPageNavigations.MYPAGE_EDIT]}
                    />
                    <IconButton<MyPageStackParamList>
                        imageSource={require('@/assets/icons/mypage/Hamburger.png')}
    //                     target={[myPageNavigations.MYPAGE_EDIT]}
                    />
                </View>
            </View>
            <ScrollView>
            {/* 기본 정보 */}
            <View style={styles.myInfoWrap}>
                {data?.profileImg ? (
                  <Image source={{ uri: data.profileImg }} style={styles.infoImg} />
                ) : (
                  <View style={[styles.infoImg, { backgroundColor: colors.GRAY_200 }]} />
                )}
                <Text style={styles.nickname}>{data?.nickname}</Text>
                <View style={styles.bioWrap}>
                    <Text style={styles.bioText}>{data?.introduction}</Text>
                </View>
                <View style={styles.musicWrap}>
                    <Image source={require('@/assets/icons/mypage/Music.png')}/>
                    { data?.profileMusic ?
                        <Text style={styles.musicText}>{data?.profileMusic?.title}</Text>
                        :
                        <Text style={styles.musicText}>등록된 프로필 뮤직이 없습니다.</Text>
                        }
                </View>
            </View>

            {/* 팔로워 & 팔로잉 */}
            <View style={styles.myInfoWrap2}>
                <View style={styles.followWrap}>
                    <View style={styles.follow}>
                        <Text style={styles.followText}>팔로워</Text>
                        <Text style={styles.countText}>{data?.followers ?? 0}명</Text>
                    </View>
                    <View style={styles.follow}>
                        <Text style={styles.followText}>팔로잉</Text>
                        <Text style={styles.countText}>{data?.followings ?? 0}명</Text>
                    </View>
                </View>
                <View style={styles.buttonWrap}>
                    <TouchableOpacity style={[styles.button, {width: 100}, isFollowing ? styles.buttonActive : null,]} onPress={onPressFollow}>
                        <Text style={[styles.followText, { color: isFollowing ? colors.GRAY_500 : colors.WHITE }]}>{isFollowing ? '팔로잉' : '팔로우'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonActive]}>
                        <Image source={require('@/assets/icons/mypage/Share.png')} style={styles.buttonImg}/>
                    </TouchableOpacity>
                </View>
            </View>

            <HarmonyRoomStrip
              communities={communities}
              onChange={(id) => {}}
              from="mypage"
            />

            {/* 마이페이지 피드 */}
            <View style={styles.tabRowScroll}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'feed' && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab('feed')}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'feed' && styles.tabTextActive,
                  ]}>
                  피드<Text style={{color:colors.GRAY_400, fontWeight: '400'}}>{' '}({feedCount.toString().padStart(3, '0')})</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                    styles.tabButton,
                    selectedTab === 'media' && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab('media')}>
                <Text
                    style={[
                    styles.tabText,
                    selectedTab === 'media' && styles.tabTextActive,
                ]}>
                    미디어
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                    styles.tabButton,
                    selectedTab === 'bookmarkFeed' && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab('bookmarkFeed')}>
                <Text
                    style={[
                    styles.tabText,
                    selectedTab === 'bookmarkFeed' && styles.tabTextActive,
                ]}>
                    저장한 피드
                </Text>
              </TouchableOpacity>
            </View>
            {/* 탭 콘텐츠 */}
            <View style={styles.tabContent}>
                {selectedTab === 'feed' && <MyPageFeedTab profileUser={userId}/>}
                {selectedTab === 'media' && <MyPageMediaTab profileUser={userId}/>}
                {selectedTab === 'bookmarkFeed' && <MyPageBookmarkTab profileUser={userId}/>}
            </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_W,
  },
  content: {
    width: '100%',
    flex: 1, alignItems: 'center'
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.LINE_GREY,
  },
  rightButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  myInfoWrap: {
    width: '100%',
    paddingVertical:16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoImg: {
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: colors.GRAY_200,
    marginBottom: 12,
  },
  nickname: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
    marginBottom: 16,
  },
  bioWrap: {
    padding: 16,
    backgroundColor: colors.BLUE_200,
    borderRadius: 16,
    marginBottom: 16,
  },
  bioText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.BLUE_700,
  },
  musicWrap: {
    width: SCREEN_W-100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  musicText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.GRAY_600,
  },
  myInfoWrap2:{
    width: '100%',
    paddingVertical:16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  followWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  follow: {
    alignItems: 'center',
    gap: 11,
  },
  followText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.BLACK,
  },
  countText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.GRAY_500,
    textAlign: 'center',
  },
  buttonWrap: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    gap: 12,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.BLUE_400,
  },
  buttonActive: {
    backgroundColor: colors.GRAY_100,
  },
  buttonImg: {
    width: 24,
    height: 24,
  },
  tabRowScroll: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: (SCREEN_W - 40)/3,
    alignItems: 'center',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.LINE_BLUE,
  },
  tabText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 22,
    color: colors.GRAY_400,
  },
  tabTextActive: {
    color: colors.BLACK,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },

});

export default PersonalProfileScreen;
