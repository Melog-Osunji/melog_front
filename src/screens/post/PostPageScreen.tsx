import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
//constants
import {postNavigations} from '@/constants';
import {colors} from '@/constants';
import {mockPosts, mockComments} from '@/constants/dummyData';
//types
import type {CommentsDTO} from '@/types';
//api
import axiosInstance from '@/api/axiosInstance';
//utils
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
//navigation
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//components
import PostStats from '@/components/post/PostStats';
import YouTubeEmbed2 from '@/components/common/YouTubeEmbed2';
import CommentList from '@/components/post/postpage/CommentList';
import CustomButton from '@/components/common/CustomButton';
import IconButton from '@/components/common/IconButton';
import PostCard from '@/components/post/PostCard';
import GradientBg from '@/components/common/styles/GradientBg';
import {usePostDetail} from '@/hooks/queries/post/usePostQueries';
import {usePostComments} from '@/hooks/queries/post/usePostQueries';

// 네비게이션 param 타입 정의
type PostPageScreenProp = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_PAGE
>;

const PostPageScreen = ({navigation, route}: PostPageScreenProp) => {
  const {postId} = route.params;

  // API 호출
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

  // CommentsDTO 전체를 전달
  console.log('[PostPageScreen] commentsData:', commentsData);

  // CommentsDTO에서 CommentDTO[] 추출
  const comments = commentsData?.comments || [];
  const displayComments: CommentsDTO = {
    comments: comments.length === 0 ? mockComments : comments,
  };

  // displayComments 출력
  useEffect(() => {
    console.log('[PostPageScreen] displayComments:', displayComments);
  }, [displayComments]);

  // 로딩 상태 처리
  if (postLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>게시글을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태 처리
  if (isPostError || !postData) {
    console.error('[PostPageScreen] 게시글 로드 실패:', postError);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>게시글을 불러올 수 없습니다.</Text>
          <Button title="다시 시도" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  console.log('[PostPageScreen] 게시글 데이터 로드 완료:', postData);
  console.log('[PostPageScreen] 댓글 데이터 로드 완료:', commentsData);
  console.log('[PostPageScreen] 댓글 배열:', comments);

  const {post, user} = postData;

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
          contentContainerStyle={{paddingBottom: 100}}>
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
                  <Text style={styles.timeText}>{post.createdAgo}시간 전</Text>
                </View>
              </View>
              <CustomButton label="팔로우" variant="filled" size="small" />
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
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              visibleStats={['like', 'share', 'bookmark']}
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
                commentsData={displayComments}
                totalCommentCount={post.commentCount || 0}
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
    fontSize: 16,
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
    // paddingHorizontal: 12,
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
