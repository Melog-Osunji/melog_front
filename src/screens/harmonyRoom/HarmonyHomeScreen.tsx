import React, { useCallback, useMemo, useState } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import {colors, postNavigations, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {RecentHarmonyRoomData, RecommendRoomData} from '@/constants/dummyData';
import HarmonyRoomStrip from '@/components/harmonyRoom/HarmonyRoomStrip';
import RecommendCard from '@/components/harmonyRoom/RecommendCard';
import RecentMediaCard from '@/components/harmonyRoom/RecentMediaCard';
import {
  useMyHarmonyRoomAll,
  useHarmonyRecentMedia,
  useHarmonyRecommendRooms,
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';


const {width: SCREEN_W} = Dimensions.get('window');

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

function HarmonyHomeScreen() {

  const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

  const {
      data: myRoomsDTO,
      isLoading: myRoomsLoading,
      isError: myRoomsError,
      refetch: refetchMyRooms,
  } = useMyHarmonyRoomAll();

  const {
      data: recentMediaDTO,
      isLoading: recentLoading,
      isError: recentError,
      refetch: refetchRecent,
  } = useHarmonyRecentMedia();

  const {
      data: recommendDTO,
      isLoading: recommendLoading,
      isError: recommendError,
      refetch: refetchRecommend,
  } = useHarmonyRecommendRooms();

  useFocusEffect(
     useCallback(() => {
       refetchMyRooms();
       refetchRecent();
       refetchRecommend();
     }, [refetchMyRooms, refetchRecent, refetchRecommend])
  );

  const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        await Promise.all([refetchMyRooms(), refetchRecent(), refetchRecommend()]);
      } finally {
        setRefreshing(false);
      }
  }, [refetchMyRooms, refetchRecent, refetchRecommend]);

  console.log(myRoomsDTO);

  const communitiesForStrip = useMemo(() => {
    if (!myRoomsDTO) return [];

    // id가 number일 수도 있으니 문자열로 통일
    type R = { id: string | number; name: string; profileImg?: string };

    const map = new Map<string, { id: string; name: string; coverUri?: string; isOwner?: boolean; isFavorite?: boolean }>();

    const upsert = (r: R, flags?: Partial<{ isOwner: boolean; isFavorite: boolean }>) => {
      const key = String(r.id);
      const prev = map.get(key) ?? { id: key, name: r.name, coverUri: r.profileImg };
      map.set(key, { ...prev, ...flags, isOwner: prev.isOwner || flags?.isOwner, isFavorite: prev.isFavorite || flags?.isFavorite });
    };

    // 내가 운영
    (myRoomsDTO.myHarmony ?? []).forEach((r: R) => upsert(r, { isOwner: true }));
    // 내가 즐겨찾기
    (myRoomsDTO.bookmarkHarmony ?? []).forEach((r: R) => upsert(r, { isFavorite: true }));
    // 내가 가입
    (myRoomsDTO.harmony ?? []).forEach((r: R) => upsert(r));

    return Array.from(map.values());
  }, [myRoomsDTO]);


  const recentMedias = recentMediaDTO?.recentMedia ?? [];

  const recommendRooms = recommendDTO?.recommendedRooms ?? [];

  const SectionLoader = () => (
    <View style={styles.loaderWrap}><ActivityIndicator /></View>
  );

  const SectionError = ({ text }: { text?: string }) => (
    <View style={styles.errorWrap}><Text style={styles.errorText}>{text ?? '불러오는 중 오류가 발생했어요.'}</Text></View>
  );
  const EmptyRow = ({ text }: { text: string }) => (
    <View style={styles.emptyWrap}><Text style={styles.emptyText}>{text}</Text></View>
  );

  console.log(myRoomsDTO);
  return (
    <LinearGradient
      colors={['#EFFAFF', colors.WHITE]} // 원하는 색 배열
      start={{x: 1, y: 0}}
      end={{x: 1, y: 0.3}}
      style={styles.container}
    >
        <SafeAreaView style={styles.content}>
            {/* 헤더 */}
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Image source={require('@/assets/icons/harmonyRoom/HarmonyRoomLogo.png')} style={styles.headerImg}/>
                    <Text style={styles.headerText}>하모니룸</Text>
                </View>
                <View style={styles.headerBtn}>
                <IconButton<MyPageStackParamList>
                    imageSource={require('@/assets/icons/harmonyRoom/HarmonyRoomCreate.png')}
                    target={[harmonyNavigations.HARMONY_CREATE]}
                />
                <IconButton<MyPageStackParamList>
                    imageSource={require('@/assets/icons/post/Search.png')}
//                     target={[harmonyNavigations.HARMONY_CREATE]}
                />
                <IconButton<MyPageStackParamList>
                    imageSource={require('@/assets/icons/post/Notice.png')}
//                     target={[harmonyNavigations.HARMONY_CREATE]}
                />
                </View>
            </View>
            <ScrollView style={styles.scroll}>
                {/* 나의 하모니룸 */}
                <View style={styles.section1}>
                    <Text style={styles.title}>나의 하모니룸</Text>
                    {myRoomsLoading && <SectionLoader />}
                    {!myRoomsLoading && !myRoomsError && (
                      communitiesForStrip.length > 0 ? (
                          <HarmonyRoomStrip
                          communities={communitiesForStrip}
                          onChange={(id) => {
                          }}/>
                    ) : (
                        <EmptyRow text="아직 가입한 하모니룸이 없어요." />
                      )
                  )}
                </View>
                {/* 최근 업로드된 미디어 */}
                <View style={styles.section2}>
                    <Text style={styles.title}>최근 업로드된 미디어</Text>
                    {recentLoading && <SectionLoader />}
                    {recentError && <SectionError text="최근 미디어를 불러오지 못했어요." />}
                    {!recentLoading && !recentError && (
                      recentMedias.length > 0 ? (
                        <FlatList
                          data={recentMedias}
                          keyExtractor={(item, index) => `${item.postID}_${index}`}
                          renderItem={({ item }) => (
                            <RecentMediaCard data={item} />
                          )}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.horizontalListContent}
                          ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                        />
                      ) : (
                        <EmptyRow text="최근 업로드된 미디어가 없어요." />
                      )
                    )}
                </View>
                <View style={styles.section3}>
                    <Text style={styles.title}>추천 하모니룸</Text>
                    {recommendRooms.map((item, idx) => (
                        <View key={`${item.roomID}_${idx}`} style={styles.horizontalListContent}>
                          <RecommendCard data={item} />
                        </View>
                    ))}
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
  headerTitle: {
    flexDirection: 'row',
    gap: 6,
  },
  headerText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
  },
  headerBtn: {
    flexDirection: 'row',
    gap: 9,
  },
  scroll: {
    marginBottom: 60,
  },
  section1: {
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LINE_GREY,
  },
  title: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
    paddingHorizontal: 20,
  },
  section2: {
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.LINE_GREY,
  },

  horizontalListContent: {
    paddingHorizontal: 20,
  },
  section3: {
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 16,
  },
  emptyWrap: { paddingVertical: 12, paddingHorizontal: 20 },
  emptyText: { color: colors.GRAY_400, fontSize: 13 },
});

export default HarmonyHomeScreen;
