import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import {Post} from '@/constants/types';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import YouTubeEmbed2 from '@/components/common/YouTubeEmbed2';
import PostStats from '@/components/post/PostStats';
import IconButton from '@/components/common/IconButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {postNavigations} from '@/constants';

type PostCardNavigationProp = StackNavigationProp<PostStackParamList>;

function PostCard(post: Post) {
  const {
    id,
    user,
    createdAgo,
    content,
    mediaUrl,
    tags,
    likeCount,
    commentCount,
  } = post;
  const navigation = useNavigation<PostCardNavigationProp>();

  const handlePress = () => {
    navigation.navigate(postNavigations.POST_PAGE, {
      postId: id,
      postData: post,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
      delayPressIn={0}>
      {/* 사용자 정보 */}
      <View style={styles.header}>
        <View style={styles.userWrapper}>
          <Image source={{uri: user.profileImg}} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.nickName}>{user.nickName}</Text>
            <Text style={styles.timeText}>{createdAgo}시간 전</Text>
          </View>
        </View>
        <IconButton
          imageSource={require('@/assets/icons/post/Info.png')}
          size={24}
        />
      </View>

      {/* 본문 */}
      <Text style={styles.content}>{content}</Text>

      {/* 태그 */}
      <View style={styles.tags}>
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      {/* 유튜브 영상 */}
      {mediaUrl &&
        (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) && (
          <YouTubeEmbed url={mediaUrl} />
        )}

      {/* 상태바 */}
      <PostStats likeCount={likeCount} commentCount={commentCount} />

      {/* 베스트 댓글 */}
      {post.bestComment && (
        <View style={styles.bestCommentContainer}>
          <Image
            source={{uri: post.bestComment.profileImg}}
            style={styles.bestCommentProfileImage}
          />
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
