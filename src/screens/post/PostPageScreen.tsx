import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Button,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
//constants
import {postNavigations} from '@/constants';
import {colors} from '@/constants';
//utils
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
//navigations
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//components
import PostStats from '@/components/post/PostStats';
import YouTubeEmbed2 from '@/components/common/YouTubeEmbed2';
import CommentList from '@/components/post/postpage/CommentList';
import CommentBar from '@/components/post/postpage/CommentBar';
import IconButton from '@/components/common/IconButton';
import GradientBg from '@/components/common/styles/GradientBg';
import CustomButton from '@/components/common/CustomButton';
import {showToast} from '@/components/common/ToastService';
import Loading from '@/components/common/Loading';
//Queries
import {usePostDetail} from '@/hooks/queries/post/usePostQueries';
import {usePostComments} from '@/hooks/queries/post/usePostQueries';
import {useFollowUser} from '@/hooks/queries/User/useUserMutations';
import {useGetUserFollowing} from '@/hooks/queries/User/useUserQueries';
import {PostDTO, UserDTO} from '@/types';

type PostPageScreenProp = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_PAGE
>;

const PostPageScreen = ({navigation, route}: PostPageScreenProp) => {
  const {postId} = route.params;

  useHideTabBarOnFocus();

  // post 및 commnet 데이터 로드
  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
    isError: isPostError,
  } = usePostDetail(postId);
  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = usePostComments(postId);

  // 항상 훅 호출 — 네트워크 요청은 내부 enabled로 제어
  const followingQuery = useGetUserFollowing(postData?.user?.id ?? '');
  const followingData = followingQuery?.data; // FollowResponseDto | undefined
  const followMutation = useFollowUser();
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // 안전하게 post / user를 옵셔널로 가져옵니다 (즉시 구조분해하지 않음).
  // 이 변수들은 렌더 초기에 undefined일 수 있지만 훅 호출 순서는 변하지 않습니다.
  const post = postData?.post as PostDTO;
  const user = postData?.user as UserDTO;

  // postData.user.id가 생기면 즉시 refetch (hook은 항상 호출됨)
  useEffect(() => {
    const userId = postData?.user?.id;
    if (userId && typeof followingQuery?.refetch === 'function') {
      console.log(
        '[PostPageScreen] postData.user.id 변경, 팔로잉 상태 재조회:',
        userId,
      );
      followingQuery.refetch().catch(() => {});
    }
  }, [postData?.user?.id]);

  // followingData 변경 시 isFollow 즉시 갱신
  useEffect(() => {
    if (!followingData) return;
    console.log(
      '[PostPageScreen] followingData 변경, isFollow 설정:',
      followingData,
    );
    setIsFollow(false);
    if (followingData.status === 'REQUESTED') setIsFollow(true);
  }, [followingData]);

  // 팔로우/언팔로우 토글 핸들러 (user?.id 사용)
  const handleToggleFollow = useCallback(() => {
    if (!user?.id) return;

    const previous = isFollow;
    setIsFollow(!previous);
    console.log('[PostPageScreen] handleToggleFollow', {
      userId: user.id,
      previous,
      new: !previous,
    });

    followMutation.mutate(user.id, {
      onError: () => {
        setIsFollow(previous);
        showToast(
          previous ? '언팔로우에 실패했어요.' : '팔로우에 실패했어요.',
          'error',
        );
      },
    });
  }, [followMutation, user?.id, isFollow]);

  // replyTarget 상태/핸들러
  type ReplyTarget = {id: string; nickname: string; commentId?: string} | null;
  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);

  const handleReply = useCallback(
    (target: {commentId?: string; id?: string; nickname: string}) => {
      const id = target.id ?? target.commentId;
      if (!id) return;
      setReplyTarget({
        id,
        nickname: target.nickname,
        commentId: target.commentId ?? undefined,
      });
    },
    [],
  );

  const handleCancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const handleSendComment = useCallback(
    (
      text: string,
      reply?: {id: string; nickname: string; commentId?: string} | null,
    ) => {
      console.log('[PostPageScreen] send comment', {text, reply});
      setReplyTarget(null);
    },
    [route.params.postId],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // 안전: postData가 준비될 때까지 로딩 화면을 보여줍니다.
  if (postLoading || !postData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loading text={'게시글을 불러오는 중...'} />
        </View>
      </SafeAreaView>
    );
  }

  // 여기서는 post/user가 존재함이 보장됩니다.
  // (위에서 이미 안전하게 선언된 post/user 변수를 사용)
  // 타입 단언이 필요하면 아래처럼 사용할 수 있습니다:
  // const { post: postVal, user: userVal } = postData as { post: PostDTO; user: UserDTO };

  return (
    <SafeAreaView style={styles.container}>
      <GradientBg>
        {/* 헤더 */}
        <View style={headerStyles.container}>
          <IconButton
            imageSource={require('@/assets/icons/post/BackArrow.png')}
            target={'goBack'}
            size={24}
          />

          <View style={headerStyles.rightButtons}>
            <IconButton
              imageSource={require('@/assets/icons/post/Search.png')}
              size={32}
            />
            <IconButton
              imageSource={require('@/assets/icons/post/Info.png')}
              size={32}
            />
          </View>
        </View>

        {/* 본문 및 댓글 섹션 */}
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.BLUE_400]}
              tintColor={colors.BLUE_400}
            />
          }>
          {/* 미디어 */}
          {post.mediaUrl && (
            <View style={styles.media}>
              {post.mediaUrl.includes('youtube.com') ||
              post.mediaUrl.includes('youtu.be') ? (
                <YouTubeEmbed2 url={post.mediaUrl} borderRadius={0} />
              ) : (
                <Image
                  source={{uri: post.mediaUrl}}
                  style={styles.fullWidthImage}
                />
              )}
            </View>
          )}

          <View style={styles.postContainer}>
            {/* 사용자 정보 */}
            <View style={styles.userSection}>
              <View style={styles.userWrapper}>
                <Image
                  source={{uri: user.profileImg}}
                  style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.nickName}>{user.nickName}</Text>
                  <Text style={styles.timeText}>{post.createdAgo}</Text>
                </View>
              </View>
              <CustomButton
                label={isFollow ? '언팔로우' : '팔로우'}
                size="small"
                onPress={handleToggleFollow}
                style={{
                  backgroundColor: isFollow ? colors.GRAY_200 : colors.BLUE_400,
                }}
              />
            </View>

            {/* 본문 */}
            <Text style={styles.content}>{post.content}</Text>

            {/* 태그 */}
            <View style={styles.tags}>
              {(post.tags ?? []).map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>

            {/* 통계 */}
            <PostStats
              id={post.id}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              visibleStats={['like', 'share', 'bookmark']}
              initialIsLiked={post.isLike}
              initialIsBookmarked={post.isBookmark}
            />
          </View>

          {/* 댓글 섹션 */}
          <View style={styles.commentsSection}>
            {commentsLoading ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator size="small" color={colors.BLUE_600} />
                <Text>댓글을 불러오는 중...</Text>
              </View>
            ) : commentsError ? (
              <Text style={styles.commentsError}>
                댓글을 불러올 수 없습니다.
              </Text>
            ) : commentsData ? (
              <CommentList
                commentsData={commentsData}
                totalCommentCount={post?.commentCount ?? 0}
                postId={route.params.postId}
                onReply={handleReply}
              />
            ) : null}
          </View>

          {/* 관련 포스트 섹션 */}
          {/* <View style={styles.relatedPostsSection}>
            <Text style={styles.sectionTitle}>관련이 높은 포스팅</Text>
            {(mockPosts || [])
              .filter((p: Post) => p.id !== post.id)
              .slice(0, 1)
              .map((dummyPost: Post) => (
                <PostCard key={dummyPost.id} {...dummyPost} />
              ))}
          </View> */}
        </ScrollView>

        {/* 댓글 입력 바 */}
        <CommentBar
          postId={postId}
          replyTarget={replyTarget}
          onCancelReply={handleCancelReply}
          onSend={handleSendComment}
        />
      </GradientBg>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nickname: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  postContainer: {
    backgroundColor: colors.WHITE,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    color: colors.BLACK,
    marginLeft: 8,
  },
  nickName: {
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  title: {
    color: colors.BLACK,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BLACK,
  },
  media: {
    backgroundColor: colors.GRAY_200,
    overflow: 'hidden',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    color: colors.BLUE_600,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  fullWidthImage: {
    width: '100%',
    height: 200,
  },
  relatedPostsSection: {
    backgroundColor: colors.WHITE,
    paddingVertical: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  commentsSection: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderTopColor: colors.GRAY_200,
  },
  commentsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  commentsError: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 16,
  },
  refreshOverlay: {
    position: 'absolute' as const,
    top: 6, // 화면 상단에서 살짝 아래
    left: 0,
    right: 0,
    height: 20, // 작게 20px
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: 'transparent',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
    backgroundColor: colors.WHITE,
  },
  leftButton: {
    padding: 8,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
});

export default PostPageScreen;
