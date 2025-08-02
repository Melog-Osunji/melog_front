import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
import {Post} from '@/constants/types';

type PostStatsProps = Pick<Post, 'likeCount' | 'commentCount'> & {};

const PostStats = ({likeCount, commentCount}: PostStatsProps) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
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

        <View style={styles.statItem}>
          <Image
            source={require('@/assets/icons/post/Comment.png')}
            style={styles.icon}
          />
          <Text style={styles.statText}>{commentCount || 0}</Text>
        </View>

        <TouchableOpacity style={styles.statItem}>
          <Image
            source={require('@/assets/icons/post/Share.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

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
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
