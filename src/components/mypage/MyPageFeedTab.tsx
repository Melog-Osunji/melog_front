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

type Props = {
  profileUser?: string; // ← 통합 포인트
};

const MyPageFeedTab: React.FC<Props> = ({profileUser}) => {
  const {data, isLoading, isError, refetch, isRefetching} = useMyPage(profileUser);

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

  const posts = useMemo(() => {
    if (!data?.posts.results) return [];

    return data.posts.results.map((p: any) => ({
    post: p.post, // ✔ 서버 그대로 사용
    user: {
      id: p.user?.id,
      nickName: data.nickname || 'test',
      profileImg: data.profileImg || '',
    },
    }));
  }, [data]);

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>아직 작성한 피드가 없어요</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      {posts.map((item, index) => (
        <PostCard post={item.post} user={item.user} key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  content: {
    flex: 1,
    width: SCREEN_W,
    marginBottom: 64,
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

export default MyPageFeedTab;
