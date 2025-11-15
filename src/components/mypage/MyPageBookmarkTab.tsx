import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import {colors} from '@/constants';
import {useMyPage} from '@/hooks/queries/myPage/useMyPage';
import PostCard from '@/components/post/PostCard';

const {width: SCREEN_W} = Dimensions.get('window');

const MyPageBookmarkTab = () => {
  const {data, isLoading, isError, refetch, isRefetching} = useMyPage();

  const bookmarkPost = useMemo(() => {
    if (!data?.bookmarks) return [];

    const userInfo = {
      id: data.id ?? '',
      nickName: data.nickname ?? '알 수 없음',
      profileImg: data.profileImg ?? '',
    };
    return data.bookmarks.map((p: any) => ({
      post: {
        id: p.id,
        title: p.title,
        content: p.content,
        mediaType: p.mediaType,
        mediaUrl: p.mediaUrl,
        tags: p.tags || [],
        createdAgo: p.createdAgo ?? 0, // 없을 수 있으므로 0 기본값
        likeCount: p.likeCount ?? 0,
        commentCount: p.commentCount ?? 0,
        bestComment: p.bestComment,
      },
      user: userInfo, // 모든 포스트에 동일한 유저 정보 넣기
    }));
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.BLUE_500} />
        <Text style={styles.loadingText}>피드를 불러오는 중...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>피드를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  if (bookmarkPost.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>아직 북마크한 피드가 없어요</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      {bookmarkPost.map(item => (
        <PostCard key={item.post.id} post={item.post} user={item.user} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: SCREEN_W,
    marginBottom: 64,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 28,
    color: colors.GRAY_600,
  },
  genreSection: {
    marginVertical: 16,
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  keyword: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.GRAY_100,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordText: {
    fontSize: 14,
    color: colors.GRAY_400,
  },
});

export default MyPageBookmarkTab;
