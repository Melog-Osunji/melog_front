import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
import {PostDTO} from '@/types';

type StatsType = 'like' | 'comment' | 'share' | 'bookmark';

type PostStatsProps = Pick<PostDTO, 'likeCount' | 'commentCount'> & {
  visibleStats?: StatsType[];
};

const PostStats = ({
  likeCount,
  commentCount,
  visibleStats = ['like', 'comment', 'share', 'bookmark'],
}: PostStatsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount || 0);

  const handleLikePress = () => {
    if (isLiked) {
      setCurrentLikeCount(prev => prev - 1);
    } else {
      setCurrentLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const renderLike = () => {
    if (!visibleStats.includes('like')) return null;

    return (
      <TouchableOpacity style={styles.statItem} onPress={handleLikePress}>
        <Image
          source={
            isLiked
              ? require('@/assets/icons/post/Heart_activate.png')
              : require('@/assets/icons/post/Heart.png')
          }
          style={styles.icon}
        />
        <Text style={styles.statText}>{currentLikeCount}</Text>
      </TouchableOpacity>
    );
  };

  const renderComment = () => {
    if (!visibleStats.includes('comment')) return null;

    return (
      <View style={styles.statItem}>
        <Image
          source={require('@/assets/icons/post/Comment.png')}
          style={styles.icon}
        />
        <Text style={styles.statText}>{commentCount || 0}</Text>
      </View>
    );
  };

  const renderShare = () => {
    if (!visibleStats.includes('share')) return null;

    return (
      <TouchableOpacity style={styles.statItem}>
        <Image
          source={require('@/assets/icons/post/Share.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  };

  const renderBookmark = () => {
    if (!visibleStats.includes('bookmark')) return null;

    return (
      <TouchableOpacity style={styles.statItem} onPress={handleBookmarkPress}>
        <Image
          source={
            isBookmarked
              ? require('@/assets/icons/post/Bookmark_activate.png')
              : require('@/assets/icons/post/Bookmark.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  };

  const leftStats = [renderLike(), renderComment()].filter(Boolean);
  const rightStats = [renderShare(), renderBookmark()].filter(Boolean);

  return (
    <View style={styles.container}>
      {leftStats.length > 0 && <View style={styles.statsRow}>{leftStats}</View>}
      {rightStats.length > 0 && (
        <View style={styles.statsRow}>{rightStats}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.GRAY_300,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default PostStats;
