import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
//constants
import {colors, postNavigations, defaultFeedTypes} from '@/constants';
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
        {selectedFeed.label} 피드를 불러오는 중...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={s_styles.container}>
      <Text style={s_styles.errorText}>
        {selectedFeed.label} 피드를 불러오는데 실패했습니다
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
        <IconButton<PostStackParamList>
          imageSource={require('@/assets/icons/post/Notice.png')}
          target={[postNavigations.POST_SEARCH]}
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
  if (error) {
    content = renderError();
  } else if (isLoading) {
    content = renderLoading();
  } else {
    content = (
      <>
        <PostList
          data={apiPosts?.results as PostWithUserDTO[]}
          ListHeaderComponent={
            <HroomNaviBtn
              rooms={rooms}
              onRoomSelect={onRoomSelect}
              isLoading={isLoading}
              error={error}
            />
          }
        />
        <View style={styles.writeButton}>
          <IconButton<PostStackParamList>
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
