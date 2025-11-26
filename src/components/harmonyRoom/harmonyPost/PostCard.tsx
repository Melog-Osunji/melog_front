import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import {PostDTO, UserDTO} from '@/types';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import PostStats from '@/components/harmonyRoom/harmonyPost/PostStats';
import PostOptionsSheet from '@/components/harmonyRoom/harmonyPost/PostOptionsSheet';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {harmonyNavigations} from '@/constants';

type PostCardNavigationProp = StackNavigationProp<HarmonyStackParamList>;

type PostCardProps = {
  post: PostDTO;
  user: UserDTO;
  harmonyId: string;
};

function PostCard({post, user, harmonyId}: PostCardProps) {
  const navigation = useNavigation<PostCardNavigationProp>();

  const handlePress = () => {
    const routes = navigation.getState()?.routeNames ?? [];

    navigation.navigate(harmonyNavigations.HARMONY_FEED, { postId: post.id, harmonyId: harmonyId });
  };

  console.log(post.id);
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
      delayPressIn={0}>
      {/* 사용자 정보 */}
      <View style={styles.header}>
        <View style={styles.userWrapper}>
          <Image
            source={
              user?.profileImg
                ? { uri: user.profileImg }
                : require('@/assets/icons/common/EmptyProfile.png')
            }
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.nickName}>{user.nickName}</Text>
            <Text style={styles.timeText}>{post.createdAgo}</Text>
          </View>
        </View>
        <PostOptionsSheet user={user} postId={post.id} />
      </View>

      {/* 본문 */}
      <Text style={styles.content}>{post.content}</Text>

      {/* 태그 */}
      <View style={styles.tags}>
        {post.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      {/* 유튜브 영상 */}
      {post?.mediaUrl &&
        (post.mediaUrl.includes('youtube.com') ||
          post.mediaUrl.includes('youtu.be')) && (
          <YouTubeEmbed url={post.mediaUrl} />
        )}

      {/* 상태바 */}
      <PostStats
        id={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        visibleStats={['like', 'share', 'bookmark']}
        initialIsLiked={post.isLike}
        isBookmark={post.isBookmark}
      />

      {/* 베스트 댓글 */}
      {post.bestComment && (
        <View style={styles.bestCommentContainer}>
          {/* <Image
            source={{uri: post.bestComment.profileImg}}
            style={styles.bestCommentProfileImage}
          /> */}
          <Text
            style={styles.bestCommentContent}
            numberOfLines={1}
            ellipsizeMode="tail">
            {post.bestComment.content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  content: {
    fontSize: 14,
    color: colors.BLACK,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    color: colors.BLUE_600,
  },
  bestCommentContainer: {
    backgroundColor: '#F5F7F8',
    borderRadius: 8,
    padding: 12,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestCommentProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bestCommentLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_500,
    lineHeight: 16,
  },
  bestCommentContent: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.BLACK,
    lineHeight: 20,
    marginLeft: 8,
  },
});

export default PostCard;
