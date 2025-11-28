import React, {useState, useEffect, useCallback, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
//constants
import {
  colors,
  postNavigations,
  defaultFeedTypes,
  commonNavigations,
} from '@/constants';
//types
import type {FeedType, PostWithUserDTO} from '@/types';
//navigation
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//hooks
import {usePostsByFeedId} from '@/hooks/queries/post/usePostQueries';
import {useHarmonyRecommendRooms} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
//components
import HroomNaviBtn from '@/components/post/posthome/HroomNaviBtn';
import PostList from '@/components/post/PostList';
import IconButton from '@/components/common/IconButton';
import FeedSelector from '@/components/post/posthome/FeedSelector';
import GradientBg from '@/components/common/styles/GradientBg';
import {showToast} from '@/components/common/ToastService';

type PostHomeScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: PostHomeScreenProps) {
  //state
  const [selectedFeed, setSelectedFeed] = useState<FeedType>(
    defaultFeedTypes[0],
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room1');

  // 하모니룸 추천 API에서 데이터 가져와서 navibtn에 전달
  const {data, isLoading, error} = useHarmonyRecommendRooms();

  const rooms =
    (data as any)?.recommendedRooms?.map((r: any) => ({
      id: r.id,
      name: r.name ?? r.intro ?? '하모니룸',
      image: r.profileImgLink ?? r.profileImg ?? undefined,
    })) ?? [];

  // 하모니룸 선택 handler
  const onRoomSelect = useCallback(
    (roomId: string) => {
      console.log(
        `[PostHomeScreen] 하모니룸 변경: ${selectedRoomId} → ${roomId}`,
      );
      setSelectedRoomId(roomId);
    },
    [selectedRoomId],
  );

  // 피드 선택 handler
  const handleFeedSelect = useCallback(
    (feed: FeedType) => {
      setSelectedFeed(feed);
    },
    [selectedFeed.label],
  );

  // 포스트 조회
  const {data: apiPosts, refetch} = usePostsByFeedId(selectedFeed.id);

  // Pull-to-refresh 상태 관리
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // 로컬 복사본으로 관리 (optimistic update)
  const [posts, setPosts] = useState<PostWithUserDTO[]>([]);
  useEffect(() => {
    setPosts((apiPosts?.results as PostWithUserDTO[]) ?? []);
  }, [apiPosts]);

  const handleHidePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(p => p.post.id !== postId));
    showToast('피드를 숨겼습니다.', 'success');
  }, []);

  const handleBlockUser = useCallback((userId: string) => {
    setPosts(prev => prev.filter(p => p.user.id !== userId));
    showToast('사용자를 차단했습니다.', 'success');
  }, []);

  // 신고 처리: 신고 후 해당 포스트를 목록에서 제거
  const handleReportPost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(p => p.post.id !== postId));
    showToast('신고가 접수되었습니다. 해당 피드를 숨깁니다.', 'success');
    // TODO: 서버 신고 API 호출이 필요하면 여기서 실행
  }, []);

  // 재시도 handler
  const handleRetry = useCallback(() => {
    console.log('[PostHomeScreen] 포스트 다시 불러오기 시도');
    refetch();
  }, [refetch]);

  console.log('[PostHomeScreen] 현재 상태:', {
    selectedFeedId: selectedFeed.id,
    selectedFeedLabel: selectedFeed.label,
    apiPostsCount: apiPosts?.results?.length || 0,
    isLoading,
    hasError: !!error,
  });

  // 에러/로딩 상태 컴포넌트
  const renderLoading = () => (
    <View style={s_styles.container}>
      <ActivityIndicator size="large" color={colors.BLUE_400} />
      <Text style={s_styles.loadingText}>
        {selectedFeed.label}를 불러오는 중...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={s_styles.container}>
      <Text style={s_styles.errorText}>
        {selectedFeed.label}를 불러오는데 실패했습니다
      </Text>
      <TouchableOpacity style={s_styles.retryButton} onPress={handleRetry}>
        <Text style={s_styles.retryText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  // 메인 헤더 컴포넌트
  const renderHeader = () => (
    <View style={styles.header}>
      <FeedSelector
        selectedFeed={selectedFeed}
        onFeedSelect={handleFeedSelect}
      />
      <View style={styles.headerIconRow}>
        <IconButton<PostStackParamList>
          imageSource={require('@/assets/icons/post/Search.png')}
          target={[postNavigations.POST_SEARCH]}
        />
        <IconButton
          imageSource={require('@/assets/icons/post/Notice.png')}
          target={[commonNavigations.ALARM]}
        />
      </View>
    </View>
  );

  // 에러 상태 처리
  useEffect(() => {
    if (error) {
      console.error('[PostHomeScreen] 포스트 조회 에러:', error);
      showToast('피드를 불러오는 중 오류가 발생했습니다.', 'error');
    }
  }, [error]);

  // 화면 상태 결정
  let content;
  // animated hide for HroomNaviBtn when list is scrolled
  const headerHideAnim = useRef(new Animated.Value(0)).current; // 0: visible, 1: hidden
  const headerHiddenRef = useRef(false);
  const HIDE_THRESHOLD = 8; // threshold in px to consider "scrolled"

  const setHeaderHidden = useCallback(
    (hide: boolean) => {
      if (headerHiddenRef.current === hide) return;
      headerHiddenRef.current = hide;
      Animated.timing(headerHideAnim, {
        toValue: hide ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    },
    [headerHideAnim],
  );

  // callback passed to PostList to receive scroll offset
  const handleListScrollOffset = useCallback(
    (y: number) => {
      if (y > HIDE_THRESHOLD) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
    },
    [setHeaderHidden],
  );

  // Build content: keep HroomNaviBtn independent (absolute/overlay)
  if (error) {
    content = renderError();
  } else if (isLoading) {
    content = renderLoading();
  } else {
    content = (
      <>
        {/* PostList remains normal; we pass onScrollOffset */}
        <View style={{paddingTop: 50, paddingBottom: 80}}>
          <PostList
            data={posts}
            onHide={handleHidePost}
            onBlock={handleBlockUser}
            onReport={handleReportPost}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onScrollOffset={handleListScrollOffset}
          />
        </View>

        {/* HroomNaviBtn is independent overlay that hides on scroll */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.hroomContainer,
            {
              transform: [
                {
                  translateY: headerHideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -56], // slide up out of view
                    extrapolate: 'clamp',
                  }),
                },
              ],
              opacity: headerHideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          <HroomNaviBtn
            rooms={rooms}
            onRoomSelect={onRoomSelect}
            isLoading={isLoading}
            error={error}
          />
        </Animated.View>

        <View style={styles.writeButton}>
          <IconButton
            imageSource={require('@/assets/icons/post/Write.png')}
            target={[postNavigations.POST_CREATE]}
            size={72}
          />
        </View>
      </>
    );
  }

  return (
    <GradientBg>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {content}
      </SafeAreaView>
    </GradientBg>
  );
}

// add style for overlaying HroomNaviBtn
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  centercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  headerIconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hroomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    zIndex: 50,
    alignItems: 'center',
  },
  writeButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const s_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.GRAY_500,
  },
  errorText: {
    fontSize: 16,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.GRAY_200,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    color: colors.WHITE,
    fontWeight: '600',
  },
});

export default PostHomeScreen;
