import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
//constants
import {colors, postNavigations, harmonyRooms} from '@/constants';
//types
import type {FeedType, createFeedTypes} from '@/constants/types';
import type {PostWithUserDTO} from '@/types';
//navigation
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//context
import {usePostContext} from '@/contexts/PostContext';
//hooks
import {usePostsByFeedType} from '@/hooks/queries/usePostQueries';
//components
import PostList from '@/components/post/PostList';
import IconButton from '@/components/common/IconButton';
import FeedSelector from '@/components/post/FeedSelector';
import GradientBg from '@/components/common/styles/GradientBg';
import HaryroomNaviBtn from '@/components/post/HaryroomNaviBtn';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: IntroScreenProps) {
  const {posts: newPosts} = usePostContext();

  // 피드 타입 생성
  const createFeedTypes = (posts: PostWithUserDTO[]): FeedType[] => [
    {
      id: 'popular',
      label: '인기',
      posts: posts,
    },
    {
      id: 'follow',
      label: '팔로우',
      posts: posts,
    },
    {
      id: 'recommend',
      label: '추천',
      posts: posts,
    },
  ];

  const feedTypes = createFeedTypes(newPosts);
  const [selectedFeed, setSelectedFeed] = useState<FeedType>(feedTypes[0]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room1');

  // 선택된 피드 타입에 따른 포스트 조회
  const {
    data: feedPosts,
    isLoading,
    error,
    refetch,
  } = usePostsByFeedType(selectedFeed.label);

  console.log('feedPosts', feedPosts);

  // 표시할 포스트 결정
  const getDisplayPosts = (): PostWithUserDTO[] => {
    // API에서 가져온 데이터가 있으면 우선 사용
    if (feedPosts?.results) {
      console.log(
        `${selectedFeed.label} 피드 데이터 사용:`,
        feedPosts.results.length,
      );
      return feedPosts.results;
    }

    // 폴백: 컨텍스트 데이터 사용
    const fallbackPosts =
      selectedFeed.posts && selectedFeed.posts.length > 0
        ? selectedFeed.posts
        : newPosts.length > 0
        ? newPosts
        : [];

    console.log(`폴백 데이터 사용:`, fallbackPosts.length);
    return fallbackPosts;
  };

  const handleFeedSelect = (feed: FeedType) => {
    console.log(`피드 변경: ${selectedFeed.label} → ${feed.label}`);
    setSelectedFeed(feed);
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  // 에러 상태 처리
  if (error) {
    console.error('포스트 조회 에러:', error);
    return (
      <GradientBg>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <FeedSelector
              selectedFeed={selectedFeed}
              onFeedSelect={handleFeedSelect}
              feedTypes={feedTypes}
            />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              포스트를 불러오는데 실패했습니다
            </Text>
            <Text style={styles.retryText} onPress={() => refetch()}>
              다시 시도
            </Text>
          </View>
        </SafeAreaView>
      </GradientBg>
    );
  }

  return (
    <GradientBg>
      <SafeAreaView style={styles.container}>
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

        {/* 로딩 상태 */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.WHITE} />
            <Text style={styles.loadingText}>
              {selectedFeed.label} 피드를 불러오는 중...
            </Text>
          </View>
        ) : (
          <PostList
            data={getDisplayPosts()}
            ListHeaderComponent={
              <HaryroomNaviBtn
                rooms={harmonyRooms}
                selectedRoomId={selectedRoomId}
                onRoomSelect={handleRoomSelect}
              />
            }
          />
        )}

        {/* Write 버튼 */}
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
  },
  errorText: {
    fontSize: 16,
    color: colors.BLACK,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    color: colors.GRAY_200,
    textDecorationLine: 'underline',
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
