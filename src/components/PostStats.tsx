import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import {ViewStyle} from 'react-native';

type PostStatsProps = {
  likes: number;
  comments: number;
  views: number;
  style?: ViewStyle;
};

const PostStats = ({likes, comments, views, style}: PostStatsProps) => {
  return (
    <View style={[styles.statsRow, style]}>
      <StatItem
        source={require('@/assets/icons/like.png')}
        value={likes || 0}
      />
      <StatItem
        source={require('@/assets/icons/comment.png')}
        value={comments || 0}
      />
      <StatItem
        source={require('@/assets/icons/view.png')}
        value={views || 0}
      />
    </View>
  );
};

const StatItem = ({source, value}: {source: any; value: number}) => (
  <View style={styles.statItem}>
    <Image source={source} style={styles.icon} />
    <Text style={styles.statText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.GRAY_800,
  },
});

export default PostStats;
