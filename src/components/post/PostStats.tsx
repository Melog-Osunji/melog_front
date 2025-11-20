import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
import {PostDTO} from '@/types';
import {
  useTogglePostLike,
  useTogglePostBookmark,
} from '@/hooks/queries/post/usePostMutations';
import {showToast} from '@/components/common/ToastService';

type StatsType = 'like' | 'comment' | 'share' | 'bookmark';

type PostStatsProps = Pick<PostDTO, 'id' | 'likeCount' | 'commentCount'> & {
  visibleStats?: StatsType[];
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
};

const PostStats = ({
  id: postId,
  likeCount,
  commentCount,
  visibleStats = ['like', 'comment', 'share', 'bookmark'],
  initialIsLiked = false,
  initialIsBookmarked = false,
}: PostStatsProps) => {
  const toggleLikeMutation = useTogglePostLike();
  const toggleBookmarkMutation = useTogglePostBookmark();

  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [isBookmarked, setIsBookmarked] =
    useState<boolean>(initialIsBookmarked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount || 0);

  // props가 바뀌면 상태 동기화
  useEffect(() => {
    setIsLiked(Boolean(initialIsLiked));
  }, [initialIsLiked]);

  useEffect(() => {
    setIsBookmarked(Boolean(initialIsBookmarked));
  }, [initialIsBookmarked]);

  useEffect(() => {
    setCurrentLikeCount(likeCount ?? 0);
  }, [likeCount]);

  const handleLikePress = () => {
    const prev = isLiked;
    setIsLiked(!prev);
    setCurrentLikeCount(prevCount =>
      prev ? Math.max(prevCount - 1, 0) : prevCount + 1,
    );

    toggleLikeMutation.mutate(postId, {
      onSuccess: data => {
        if (data && typeof data.likeCount === 'number') {
          setCurrentLikeCount(data.likeCount);
        }
        setIsBookmarked(prev);
        console.log('[PostStats] 좋아요 성공:', data);
      },
      onError: err => {
        console.error('[PostStats] 좋아요 실패:', err);
        setIsLiked(prev);
        setCurrentLikeCount(prevCount =>
          prev ? prevCount + 1 : Math.max(prevCount - 1, 0),
        );
      },
    });
  };

  const handleBookmarkPress = () => {
    const prev = isBookmarked;
    setIsBookmarked(!prev);

    toggleBookmarkMutation.mutate(postId, {
      onSuccess: data => {
        if (data && typeof data.bookmarked === 'boolean') {
          setIsBookmarked(data.bookmarked);
          showToast('피드를 저장했어요.', 'success');
        }
      },
      onError: err => {
        console.error('[PostStats] 북마크 실패:', err);
        setIsBookmarked(prev);
        showToast('피드를 저장에 실패했어요.', 'error');
      },
    });
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
        {/* 균형을 위해 임의로 마진 추가 */}
        <Text style={[styles.statText, {marginLeft: 3}]}>
          {commentCount || 0}
        </Text>
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
            bookmarked
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
    fontSize: 16,
    fontWeight: '500',
    color: colors.GRAY_300,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default PostStats;
