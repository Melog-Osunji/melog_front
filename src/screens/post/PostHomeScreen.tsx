import React, {useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
//constants
import {colors, postNavigations} from '@/constants';
import {createFeedTypes} from '@/constants/PostConstant';
import {harmonyRooms as DUMMY_HARMONY_ROOMS} from '@/constants/dummyData'; // 임시
//types
import type {FeedID, PostWithUserDTO} from '@/types';
//navigation
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//context
import {usePostContext} from '@/contexts/PostContext';
//hooks
import {usePostsByFeedId} from '@/hooks/queries/post/usePostQueries';
//components
import PostList from '@/components/post/PostList';
import IconButton from '@/components/common/IconButton';
import FeedSelector from '@/components/post/FeedSelector';
import GradientBg from '@/components/common/styles/GradientBg';
import HaryroomNaviBtn from '@/components/post/HaryroomNaviBtn';

type PostHomeScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: PostHomeScreenProps) {
  const {posts: contextPosts} = usePostContext();

  // 피드 타입들과 초기 선택 상태
  const feedTypes = createFeedTypes([]);
  const [selectedFeed, setSelectedFeed] = useState<FeedID>(feedTypes[0]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room1');

  // 선택된 피드 ID에 따른 포스트 조회
  const {
    data: apiPosts,
    isLoading,
    error,
    refetch,
  } = usePostsByFeedId(selectedFeed.id);

  // 표시할 포스트 결정 (API 데이터 우선, 없으면 Context 데이터)
  const getDisplayPosts = useCallback((): PostWithUserDTO[] => {
    if (apiPosts?.results && apiPosts.results.length > 0) {
      return apiPosts.results;
    }
    return contextPosts || [];
  }, [apiPosts?.results, contextPosts]);

  // 피드 선택 핸들러
  const handleFeedSelect = useCallback(
    (feed: FeedID) => {
      console.log(`피드 변경: ${selectedFeed.label} → ${feed.label}`);
      setSelectedFeed(feed);
    },
    [selectedFeed.label],
  );

  // 하모니룸 선택 핸들러
  const handleRoomSelect = useCallback(
    (roomId: string) => {
      console.log(`하모니룸 변경: ${selectedRoomId} → ${roomId}`);
      setSelectedRoomId(roomId);
    },
    [selectedRoomId],
  );

  // 재시도 핸들러
  const handleRetry = useCallback(() => {
    console.log('포스트 다시 불러오기 시도');
    refetch();
  }, [refetch]);

  console.log('🔍 현재 상태:', {
    selectedFeedId: selectedFeed.id,
    selectedFeedLabel: selectedFeed.label,
    apiPostsCount: apiPosts?.results?.length || 0,
    contextPostsCount: contextPosts?.length || 0,
    displayPostsCount: getDisplayPosts().length,
    isLoading,
    hasError: !!error,
  });

  // 에러 상태 컴포넌트
  const renderError = () => (
    <GradientBg>
      <SafeAreaView style={styles.container}>
        {/* 헤더 - 에러 상태에서도 표시 */}
        <View style={styles.header}>
          <FeedSelector
            selectedFeed={selectedFeed}
            onFeedSelect={handleFeedSelect}
            feedTypes={feedTypes}
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

        {/* 에러 메시지 */}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {selectedFeed.label} 피드를 불러오는데 실패했습니다
          </Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBg>
  );

  // 로딩 상태 컴포넌트
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.WHITE} />
      <Text style={styles.loadingText}>
        {selectedFeed.label} 피드를 불러오는 중...
      </Text>
    </View>
  );

  // 메인 헤더 컴포넌트
  const renderHeader = () => (
    <View style={styles.header}>
      <FeedSelector
        selectedFeed={selectedFeed}
        onFeedSelect={handleFeedSelect}
        feedTypes={feedTypes}
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
  if (error) {
    console.error('포스트 조회 에러:', error);
    return renderError();
  }

  return (
    <GradientBg>
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        {renderHeader()}

        {/* 메인 콘텐츠 */}
        {isLoading ? (
          renderLoading()
        ) : (
          <PostList
            data={getDisplayPosts()}
            ListHeaderComponent={
              <HaryroomNaviBtn
                rooms={DUMMY_HARMONY_ROOMS}
                selectedRoomId={selectedRoomId}
                onRoomSelect={handleRoomSelect}
              />
            }
          />
        )}

        {/* 글쓰기 버튼 */}
        <View style={styles.writeButton}>
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/Write.png')}
            target={[postNavigations.POST_CREATE]}
            size={72}
          />
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.GRAY_500,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
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
    backgroundColor: colors.WHITE,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    color: colors.WHITE,
    fontWeight: '600',
  },
  writeButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostHomeScreen;
