import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import {Post} from '@/constants/types';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import PostStats from '@/components/post/PostStats';
import IconButton from '@/components/IconButton';
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
    lineHeight: 20,
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
});

export default PostCard;
