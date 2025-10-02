import React, {useState, useEffect, useRef, useMemo} from 'react';
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
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
// PostCard 가져오기
import PostCard from '@/components/post/PostCard';
import type { Post } from '@/constants/types';
import { RefreshControl } from 'react-native';

const {width: SCREEN_W} = Dimensions.get('window');

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

export default function HarmonyPageScreen() {
    const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

    const route = useRoute<HarmonyPageScreenRouteProp>();
    const { roomID, roomData } = route.params ?? {};
    const scrollRef = useRef<ScrollView>(null);
    const { rooms } = useHarmonyRoomContext();
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectTab, setSelectTab] = useState<'rcmd' | 'popular'>('rcmd');
    const [showExitPopup, setShowExitPopup] = useState(false);

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
    } = useHarmonyIsMember(roomID);

    const currentUserId = "f4c475f1-9016-4b01-91a8-1880cf749903"; // TODO: auth context 등에서 가져오면 owner 비교 가능

    const isOwner = useMemo(() => {
      if (!roomInfo) return false;
      // roomInfo.owner: string (owner의 userId라고 가정)
      return currentUserId ? roomInfo.owner === currentUserId : false;
    }, [roomInfo, currentUserId]);

    const isMember = memberDTO?.isMember ?? false;

    // 헤더 표시용 데이터 파생
    const headerName = roomInfo?.name ?? '하모니룸';
    const headerImg = roomInfo?.profileImgLink ?? undefined;
    const headerTags = roomInfo?.category ?? [];
    const headerIntro = roomInfo?.intro ?? '';

    // FeedItem: 서버 응답 병합 형태
    type FeedItem = harmonyRoomPost & { author?: harmonyUser };

    // post[]와 user[]를 같은 index로 병합
    const pairPosts = (blocks?: harmonyRoomPosts[]) => {
      if (!blocks?.length) return [] as FeedItem[];
      const merged: FeedItem[] = [];
      for (const b of blocks) {
        const posts = b.post ?? [];
        const users = b.user ?? [];
        for (let i = 0; i < posts.length; i++) {
          merged.push({ ...posts[i], author: users[i] });
        }
      }
      return merged;
    };

    // 탭에 맞는 원천 피드
    const recommendFeed = useMemo(() => pairPosts(postsDTO?.recommend), [postsDTO]);
    const popularFeed   = useMemo(() => pairPosts(postsDTO?.popular),   [postsDTO]);

    // ★ PostCard 타입으로 최종 매핑
    const toPostCardModel = (src: FeedItem): Post => {
      // 서버 createdAgo 가 "분" 단위(number)라고 가정 → 시간 단위로 변환(최소 1시간)
      const hours = Math.max(1, Math.floor((src.createdAgo ?? 0) / 60));

      return {
        id: src.id,
        user: {
          nickName: src.author?.nickName ?? '익명',
          profileImg: src.author?.profileImg ?? '',
        },
        createdAgo: hours,                 // PostCard에서 "{createdAgo}시간 전"으로 사용
        content: src.content ?? '',
        mediaUrl: src.mediaUrl ?? '',
        tags: src.tags ?? [],
        likeCount: src.likeCount ?? 0,
        commentCount: src.commentCount ?? 0,
        // bestComment는 서버에 없으니 생략 가능
      };
    };

    const activeFeedRaw = selectTab === 'rcmd' ? recommendFeed : popularFeed;
    const activeFeed: Post[] = useMemo(
      () => activeFeedRaw.map(toPostCardModel),
      [activeFeedRaw]
    );
    const isEmpty = activeFeed.length === 0;


    // info로 이동
    const handlePress = () => {
        navigation.navigate(harmonyNavigations.HARMONY_INFO, { roomID: roomID, roomData: roomInfo });
    };

    // 가입 모달 오픈
    const handleAccess = () => {
        setShowExitPopup(true);
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
                                target={[harmonyNavigations.HARMONY_SETTING]}
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
                            <Image source={{uri: headerImg}} style={styles.roomImg}/>
                            <View style={styles.wrap}>
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
                                <Image source={require('@/assets/icons/mypage/RightArrow.png')} style={styles.iconBtn}/>
                            </View>
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
                  <FlatList
                    data={activeFeed}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PostCard {...item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    ListHeaderComponent={<View style={{ height: 0 }} />} // 상단 여백 조절용(선택)
                  />
                )}


            <ExitConfirmModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onExit={() => { setModalVisible(false); navigation.navigate(harmonyNavigations.HARMONY_HOME); }}
            />
            </ScrollView>


            {/* Write 버튼 */}
            {(isMember || isOwner) && (
                <View style={styles.writeButton}>
                    <IconButton<PostStackParamList>
                      imageSource={require('@/assets/icons/post/Write.png')}
    //                   target={[postNavigations.POST_CREATE]}
                      size={72}
                    />
                </View>
            )}

            {/* 고정된 버튼 */}
            {(!isMember && !isOwner) && (
                <Pressable style={styles.accessBtn} onPress={handleAccess}>
                    <Image source={require('@/assets/icons/harmonyRoom/Access.png')} style={styles.icon} />
                    <Text style={styles.btnText}>가입하기</Text>
                </Pressable>
            )}

        {/* }<CheckPopupOneBtn
            visible={showExitPopup}
            onClose={handleConfirmExit}
            iconImg={require('@/assets/icons/Access.png')}
            title="가입 신청 완료"
            content="승인되면 알림으로 알려드릴게요."
            btnColor={colors.BLUE_400}
            btnText="확인"
            btnTextColor={colors.WHITE}
        />*/}
        <CheckPopupOneBtn
            visible={showExitPopup}
            onClose={handleConfirmExit}
            iconImg={require('@/assets/icons/Access.png')}
            title="가입 완료"
            content="하모니룸에 가입되었어요."
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
        gap: 14,
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
        gap: 33,
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
        left: '50%',
        transform: [{ translateX: -0.5 * 120 }],
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