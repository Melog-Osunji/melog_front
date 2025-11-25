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
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
//constants
import {harmonyNavigations} from '@/constants';
import {colors} from '@/constants';
//utils
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
//navigation
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
//components
import PostStats from '@/components/harmonyRoom/harmonyPost/PostStats';
import YouTubeEmbed2 from '@/components/common/YouTubeEmbed2';
import CommentList from '@/components/harmonyRoom/harmonyPost/CommentList';
import CommentBar from '@/components/harmonyRoom/harmonyPost/CommentBar';
import IconButton from '@/components/common/IconButton';
import GradientBg from '@/components/common/styles/GradientBg';
import PostOptionsSheet from '@/components/harmonyRoom/harmonyPost/PostOptionsSheet';
import {useHarmonyPostDetail, useHarmonyPostComments} from '@/hooks/queries/harmonyRoom/useHarmonyPostQueries';
import {useUserInfo} from '@/hooks/common/useUserInfo';
import {PostDTO, UserDTO} from '@/types';
import {useMyPage} from '@/hooks/queries/myPage/useMyPage';

type HarmonyPageScreenProp = StackScreenProps<
  HarmonyStackParamList,
  typeof harmonyNavigations.HARMONY_FEED
>;

const HarmonyFeedScreen = ({navigation, route}: HarmonyPageScreenProp) => {
  const {postId, harmonyId} = route.params;

  useHideTabBarOnFocus();

  // API 호출
  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
    isError: isPostError,
  } = useHarmonyPostDetail(postId);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = useHarmonyPostComments(postId);

  const {
    data: userInfo,
    isLoading
    } = useMyPage();

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
    console.error('[HarmonyPostPageScreen] 게시글 로드 실패:', postError);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>게시글을 불러올 수 없습니다.</Text>
          <Button title="다시 시도" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const user = postData.user;

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
          {postData.mediaUrl ? (
            <View style={styles.media}>
              {postData.mediaUrl.includes('youtube.com') ||
              postData.mediaUrl.includes('youtu.be') ? (
                <YouTubeEmbed2 url={postData.mediaUrl} borderRadius={0} />
              ) : (
                <Image
                  source={{uri: postData.mediaUrl}}
                  style={styles.fullWidthImage}
                />
              )}
            </View>
          ) : null}

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
                  <Text style={styles.timeText}>{postData.createdAgo}</Text>
                </View>
              </View>
              <PostOptionsSheet user={user} postId={postId} />
            </View>

            {/* 본문 */}
            <Text style={styles.content}>{postData.content}</Text>

            {/* 태그 */}
            <View style={styles.tags}>
              {(postData.tags ?? []).map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>

            {/* 통계 */}
            <PostStats
              id={postData.id}
              likeCount={postData.likeCount}
              commentCount={postData.commentCount}
              visibleStats={['like', 'share', 'bookmark']}
              initialIsLiked={postData.isLike}
              initialIsBookmarked={postData.isBookmark}
              harmonyId={harmonyId}
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
                totalCommentCount={postData.commentCount || 0}
                postId={postId}
              />
            ) : null}
          </View>
        </ScrollView>

        {/* 댓글 입력 바 */}
        <CommentBar
          postId={postId}
          onSend={(text: string) => {
            console.log('[PostPageScreen] onSend comment:', text);
          }}
          profileUrl={userInfo?.profileImg}
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

export default HarmonyFeedScreen;
