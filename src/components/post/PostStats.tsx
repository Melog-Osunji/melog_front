import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import {Post} from '@/constants/types';
import IconButton from '@/components/IconButton';

type PostStatsProps = Pick<Post, 'likeCount' | 'commentCount'> & {};

const PostStats = ({likeCount, commentCount}: PostStatsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatItem
          source={require('@/assets/icons/post/Heart.png')}
          value={likeCount || 0}
        />
        <StatItem
          source={require('@/assets/icons/post/Comment.png')}
          value={commentCount || 0}
        />
        <StatItem source={require('@/assets/icons/post/Share.png')} />
      </View>
      <StatItem source={require('@/assets/icons/post/Bookmark.png')} />
    </View>
  );
};

const StatItem = ({source, value}: {source: any; value?: number}) => (
  <View style={styles.statItem}>
    <IconButton imageSource={source} size={24} />
    {value !== undefined ? <Text style={styles.statText}>{value}</Text> : null}
  </View>
);

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
});

export default PostStats;
