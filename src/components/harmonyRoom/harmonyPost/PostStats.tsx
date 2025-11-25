import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
import {PostDTO} from '@/types';
import {
  useToggleHarmonyPostLike,
  useToggleHarmonyPostBookmark,
} from '@/hooks/queries/harmonyRoom/useHarmonyPostMutation';
import {useHarmonyPostDetail} from '@/hooks/queries/harmonyRoom/useHarmonyPostQueries';
import { useQueryClient } from '@tanstack/react-query';
import { HARMONY_POST_QK } from '@/hooks/queries/harmonyRoom/useHarmonyPostQueries';

type StatsType = 'like' | 'comment' | 'share' | 'bookmark';

type PostStatsProps = Pick<PostDTO, 'id' | 'likeCount' | 'commentCount'> & {
  visibleStats?: StatsType[];
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
  harmonyId: string;
};

const PostStats = ({
  id: postId,
  likeCount,
  commentCount,
  visibleStats = ['like', 'comment', 'share', 'bookmark'],
  initialIsLiked,
  initialIsBookmarked,
  harmonyId,
}: PostStatsProps) => {

  const qc = useQueryClient();

  const toggleLikeMutation = useToggleHarmonyPostLike(harmonyId);
  const toggleBookmarkMutation = useToggleHarmonyPostBookmark(harmonyId);
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);
  const { data: detail } = useHarmonyPostDetail(postId);
  const isBookmarked = detail?.isBookmark ?? false;
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount || 0);

  const handleLikePress = () => {
    const prev = isLiked;
    // optimistic UI
    setIsLiked(!prev);
    setCurrentLikeCount(prevCount =>
      prev ? Math.max(prevCount - 1, 0) : prevCount + 1,
    );

    toggleLikeMutation.mutate(postId, {
      onSuccess: data => {
        // 서버가 최신 카운트를 줄 경우 동기화
        if (data && typeof data.likeCount === 'number') {
          setCurrentLikeCount(data.likeCount);
        }
      },
      onError: err => {
        console.error('[PostStats.tsx] 좋아요 실패:', err);
        // 롤백
        setIsLiked(prev);
        setCurrentLikeCount(prevCount =>
          prev ? prevCount + 1 : Math.max(prevCount - 1, 0),
        );
      },
    });
  };

  const handleBookmarkPress = () => {
    // optimistic update
    qc.setQueryData(HARMONY_POST_QK.detail(postId), old => ({
      ...old,
      isBookmark: !isBookmarked,
    }));

    toggleBookmarkMutation.mutate(
      { postId },
      {
        onError: () => {
          // rollback
          qc.setQueryData(HARMONY_POST_QK.detail(postId), old => ({
            ...old,
            isBookmark: isBookmarked,
          }));
        },
      },
    );
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
        <Text style={styles.statText}>
          {toggleLikeMutation.data?.likeCount ?? currentLikeCount}
        </Text>
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

    const bookmarked = toggleBookmarkMutation.data?.bookmarked ?? isBookmarked;

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
