import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import axios from 'axios';
import {StyleSheet, Text, View, ScrollView, Image, Dimensions, FlatList, TouchableOpacity, Keyboard, Pressable, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {colors, harmonyNavigations, postNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {HarmonyRoomDummyData} from '@/constants/types';
import ExitConfirmModal from '@/components/harmonyRoom/ExitConfirmModal';
import { useHarmonyRoomContext } from '@/contexts/HarmonyRoomContext';
import GuideModal from '@/components/harmonyRoom/GuideModal';
import LinearGradient from 'react-native-linear-gradient';
import EmptyTab from '@/components/search/EmptyTab'
import CheckPopupOneBtn from '@/components/common/CheckPopupOneBtn';
import {
  useHarmonyRoomInfo,
  useHarmonyRoomPosts,
  useHarmonyIsMember,
  useHarmonyIsWaiting,
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
// PostCard 가져오기
import PostCard from '@/components/harmonyRoom/harmonyPost/PostCard';
import type { PostDTO, UserDTO } from '@/types/postTypes';
import { RefreshControl } from 'react-native';
import { useRequestJoinHarmonyRoom } from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
import { useQueryClient } from '@tanstack/react-query';
import {useUserInfo} from '@/hooks/common/useUserInfo';

const {width: SCREEN_W} = Dimensions.get('window');

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

export default function HarmonyPageScreen() {
    const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

    const queryClient = useQueryClient();

    const route = useRoute<HarmonyPageScreenRouteProp>();
    const { roomID, roomData } = route.params ?? {};
    const scrollRef = useRef<ScrollView>(null);
    const { rooms } = useHarmonyRoomContext();

    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectTab, setSelectTab] = useState<'rcmd' | 'popular'>('rcmd');
    // 상태: 가입 상태(버튼 문구/노출 제어), 팝업 모드
    const [popupMode, setPopupMode] = useState<'joined' | 'applied'>('joined');

    const {
      userInfo,
      isLoading: userInfoLoading,
      error: userInfoError,
      refetch: refetchUser,
    } = useUserInfo();

    const {
      data: roomInfo,
      isLoading: infoLoading,
      isError: infoError,
    } = useHarmonyRoomInfo(roomID);

    const {
      data: postsDTO,
      isLoading: postsLoading,
      isError: postsError,
      refetch: refetchPosts,
    } = useHarmonyRoomPosts(roomID);

    const {
      data: memberDTO,
      isLoading: memberLoading,
      refetch: refetchMember,
    } = useHarmonyIsMember(roomID);

    const { data: waitingDTO, refetch: refetchWaiting } = useHarmonyIsWaiting(roomID);

    const { mutateAsync: requestJoin, isPending: requestLoading } = useRequestJoinHarmonyRoom(roomID);

    const currentUserId = userInfo?.id ?? null;
    const isOwner = useMemo(() => {
      if (!roomInfo) return false;
      return currentUserId ? roomInfo.owner === currentUserId : false;
    }, [roomInfo, currentUserId]);
    const serverIsMember = memberDTO?.isMember ?? false;
    const isWaiting = waitingDTO?.isWaiting ?? false;
    const effectiveIsMember = serverIsMember;

    // 헤더 표시용 데이터 파생
    const headerName = roomInfo?.name ?? '하모니룸';
    const headerImg = roomInfo?.profileImgLink ?? undefined;
    const headerTags = roomInfo?.category ?? [];
    const headerIntro = roomInfo?.intro ?? '';

    // FeedItem: 서버 응답 병합 형태
    type FeedItem = PostDTO & { author?: UserDTO };

    // post[]와 user[]를 같은 index로 병합
    const pairPosts = (blocks?: any[]) => {
      if (!blocks?.length) return [];
      return blocks.map(b => ({
        ...b.post,
        author: b.user,
      }));
    };

    // 탭에 맞는 원천 피드
    const recommendFeed = useMemo(() => pairPosts(postsDTO?.recommend), [postsDTO]);
    const popularFeed   = useMemo(() => pairPosts(postsDTO?.popular),   [postsDTO]);

    // ★ PostCard 타입으로 최종 매핑
    const toPostCardModel = (src: FeedItem): PostDTO => {
      return {
        id: src.id,
        title: src.title ?? '', // 서버에 title이 없을 수도 있으니 기본값
        content: src.content ?? '',
        mediaType: src.mediaType ?? 'image', // 기본값으로 image 지정
        mediaUrl: src.mediaUrl ?? '',
        tags: src.tags ?? [],
        createdAgo: src.createdAgo ?? 0,
        likeCount: src.likeCount ?? 0,
        hiddenUser: src.hiddenUser ?? [],
        commentCount: src.commentCount ?? 0,
        bestComment: src.bestComment
          ? {
              userID: src.bestComment.userID ?? src.author?.nickName ?? '',
              content: src.bestComment.content ?? '',
            }
          : undefined,
        isLike: src.isLike ?? false,
        isBookmark: src.isBookmark ?? false,
        user: src.author,
      };
    };

    const activeFeedRaw = selectTab === 'rcmd' ? recommendFeed : popularFeed;
    const activeFeed: PostDTO[] = useMemo(
      () => activeFeedRaw.map(toPostCardModel),
      [activeFeedRaw]
    );

    const isEmpty = activeFeed.length === 0;

    // info로 이동
    const handlePress = () => {
        navigation.navigate(harmonyNavigations.HARMONY_INFO, { roomID: roomID, roomData: roomInfo });
    };

    useFocusEffect(
      useCallback(() => {
        refetchWaiting();
        refetchMember();
        refetchPosts();
      }, [refetchWaiting, refetchMember, refetchPosts]),
    );

    // 가입 모달 오픈
    const handleAccess = async () => {
      if (!roomInfo) return;

      try {
        // 백엔드가 isDirectAssign에 맞게 처리 (멤버 추가 또는 대기열 추가)
        await requestJoin();

        await Promise.all([refetchWaiting(), refetchMember()]);

        if (roomInfo.isDirectAssign) {
          // 즉시 가입
          setPopupMode('joined');      // "가입 완료" 팝업
        } else {
          // 승인제: 대기 등록
          setPopupMode('applied');     // "가입 신청 완료" 팝업
        }

        setShowExitPopup(true);
        // 쿼리 무효화는 훅 내부 onSuccess에서 이미 처리됨
      } catch (e) {
        console.warn('❌ Join Error', e);
      }
    };

    // 폐쇄하기 확인
      const handleConfirmExit = () => {
          setShowExitPopup(false);
          navigation.goBack();
      };

    if ((infoLoading || postsLoading || memberLoading) && !roomInfo && !postsDTO) {
      return (
        <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center'}}>
           <ActivityIndicator />
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
        <SafeAreaView style={{flex: 1, width: SCREEN_W, position: 'relative'}}>
            <ScrollView
                style={{flex: 1}}
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 60, flexGlow: 1,}}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <IconButton<PostStackParamList>
                      imageSource={require('@/assets/icons/post/BackArrow.png')}
                      target={'goBack'}
                      size={24}
                      imageStyle={{tintColor: colors.GRAY_300}}
                    />
                    <View style={styles.headerBtn}>
                        {isOwner ?
                            <IconButton<MyPageStackParamList>
                                imageSource={require('@/assets/icons/harmonyRoom/Setting.png')}
                                target={[harmonyNavigations.HARMONY_SETTING, { roomID }]}
                            />
                            : <View style={{ width: 24, height: 24 }} />
                        }
                        <IconButton<MyPageStackParamList>
                            imageSource={require('@/assets/icons/post/Notice.png')}
                            target={[harmonyNavigations.HARMONY_CREATE]}
                        />
                    </View>
                </View>

                {/* 하모니룸 */}
                <View style={styles.infoWrap}>
                    <Pressable onPress={handlePress}>
                        <View style={styles.nameAndTag}>
                            <View style={styles.wrap}>
                                <LinearGradient
                                    colors={['#64C0E6', '#68E5E5']}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                    style={styles.circleGradient}
                                >
                                  <View style={styles.circleInner}>
                                    <Image
                                      source={
                                        headerImg
                                          ? { uri: headerImg }
                                          : require('@/assets/icons/common/EmptyProfile.png')
                                      }
                                      style={styles.roomImg}
                                    />
                                  </View>
                                </LinearGradient>
                                <View style={styles.roomInfo}>
                                    <View style={styles.nameWrap}>
                                        <Text style={styles.name}>{headerName}</Text>
                                        {isOwner ?
                                            <Text style={styles.manageLabel}>운영</Text>
                                            : null
                                        }
                                    </View>
                                    {!!headerTags.length && (
                                        <View style={styles.tagWrap}>
                                          {headerTags.slice(0,3).map((t, idx) => (
                                            <Text key={`${t}_${idx}`} style={styles.tags}>#{t}</Text>
                                          ))}
                                        </View>
                                      )}
                                </View>
                            </View>
                            <Image source={require('@/assets/icons/mypage/RightArrow.png')} style={styles.iconBtn}/>
                        </View>
                    </Pressable>
                     {!!headerIntro && (
                        <View style={styles.descriptionWrap}>
                          <Text style={styles.description}>{headerIntro}</Text>
                        </View>
                      )}
                </View>

                <View style={styles.line}></View>

                {/* 피드 탭 */}
                <View style={styles.tabContainer}>
                    <Pressable style={[styles.tab, selectTab === 'rcmd' && styles.activeTab]} onPress={() => setSelectTab('rcmd')}>
                        <Text style={[styles.tabText, selectTab === 'rcmd' && styles.activeText]}>추천</Text>
                    </Pressable>
                    <Pressable style={[styles.tab, selectTab === 'popular' && styles.activeTab]} onPress={() => setSelectTab('popular')}>
                        <Text style={[styles.tabText, selectTab === 'popular' && styles.activeText]}>인기</Text>
                    </Pressable>
                </View>

                {/* 피드 */}

                {postsError ? (
                  <View style={styles.emptyCenter}>
                    <Text style={{color:'#c22'}}>피드를 불러오지 못했어요.</Text>
                  </View>
                ) : isEmpty ? (
                  <View style={styles.emptyCenter}>
                    <EmptyTab subtitle={"우측 하단의 글쓰기 버튼으로\n첫 글을 작성해보세요."} />
                  </View>
                ) : (
                    <View>
                    {activeFeed.map(item => (
                      <PostCard
                        key={item.id}
                        post={item}
                        user={item.user}
                        harmonyId={roomID}
                      />
                    ))}
                    </View>
//                     <FlatList
//                       data={activeFeed}
//                       keyExtractor={(item) => item.id}
//                       renderItem={({ item }) => (
//                           <PostCard post={item} user={item.user!} />
//                       )}
//                       showsVerticalScrollIndicator={false}
//                       contentContainerStyle={{ paddingBottom: 20 }}
//                       ListHeaderComponent={<View style={{ height: 0 }} />}
//                     />
                )}


            <ExitConfirmModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onExit={() => { setModalVisible(false); navigation.navigate(harmonyNavigations.HARMONY_HOME); }}
            />
            </ScrollView>


            {/* Write 버튼 */}
            {(effectiveIsMember || isOwner) && (
              <View style={styles.writeButton}>
                <IconButton<PostStackParamList>
                  imageSource={require('@/assets/icons/post/Write.png')}
                  size={72}
                  target={[harmonyNavigations.HARMONY_POST, { harmonyId : roomID }]}
                />
              </View>
            )}

            {/* 고정된 버튼 */}
            {(!effectiveIsMember && !isOwner) && (
              <Pressable
                style={[
                  styles.accessBtn,
                  (isWaiting || requestLoading) && styles.pendingBtn
                ]}
                onPress={handleAccess}
                disabled={isWaiting || requestLoading}
              >
                {
                   (isWaiting || requestLoading)
                   ? null
                   : <Image source={require('@/assets/icons/harmonyRoom/Apply.png')} style={styles.icon} />
                }
                <Text
                    style={[
                       styles.btnText,
                       (isWaiting || requestLoading) && {color: colors.BLUE_500}
                     ]}>
                  {isWaiting ? '가입 대기중' : '가입하기'}
                </Text>
              </Pressable>
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
        </SafeAreaView>
    </LinearGradient>
    );
};

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
    headerBtn: {
        flexDirection: 'row',
        gap: 9,
    },
    infoWrap:{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 16,
    },
    nameAndTag: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    circleGradient: {
        width: 84,
        height: 84,
        borderRadius: 84 / 2,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    circleInner: {
        width: 80,      // ← 내부 원 실제 크기
        height: 80,
        borderRadius: 80 / 2, // ← 정확한 반지름
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    roomImg: {
        width: 84,
        height: 84,
        borderRadius: 999,
        backgroundColor: colors.GRAY_500,
    },
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    roomInfo: {
        flexDirection: 'column',
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
        padding:16,
    },
    description: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.BLUE_700,
    },
    line: {
        width: SCREEN_W,
        height: 6,
        backgroundColor: colors.LINE_GREY,
    },
    tabContainer: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        gap: 4,
    },
    tab: {
        paddingVertical: 9,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        borderColor: colors.GRAY_300,
        borderWidth: 1,
    },
    activeTab: {
        backgroundColor: colors.BLUE_500,
        borderWidth: 0,
    },
    tabText: {
        fontFamily: 'Noto Sans KR',
        fontSize: 15.75,
        fontWeight: '500',
        letterSpacing: 0.2,
        lineHeight: 22.5,
        color: colors.GRAY_500,
    },
    activeText: {
        color: colors.WHITE,
    },
    emptyCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    writeButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accessBtn: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        height: 44,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.BLUE_400,
        marginBottom: 22,
    },
    pendingBtn: {
        backgroundColor: colors.WHITE,
        borderWidth: 1,
        borderColor: colors.BLUE_500,
    },
    icon: {
        width: 28,
        height: 28,
    },
    btnText: {
        fontFamily: 'Noto Sans KR',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.15,
        lineHeight: 22,
        color: colors.WHITE,
    },
});