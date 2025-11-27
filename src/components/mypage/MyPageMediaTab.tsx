import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { colors } from '@/constants';
import { useMyPage } from '@/hooks/queries/myPage/useMyPage';
import PostCard from '@/components/post/PostCard';

const { width: SCREEN_W } = Dimensions.get('window');

type Props = {
  profileUser?: string; // ← 통합 포인트
};

const MyPageMediaTab: React.FC<Props> = ({profileUser})=> {
  const { data, isLoading, isError, refetch, isRefetching } = useMyPage(profileUser);

  const postMedias = useMemo(() => {
     if (!data?.mediaPosts) return [];

     return data.posts.map((p: any) => ({
       post: p.post, // ✔ 서버 그대로 사용
       user: {
         id: data.id,
         nickName: data.nickname,
         profileImg: data.profileImg,
       },
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

  if (postMedias.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>아직 작성한 미디어가 없어요</Text>
        </View>
      );
  }

  return (
    <View style={styles.content}>
    {postMedias.map(item => (
      <PostCard
        key={item.post.id}
        post={item.post}
        user={item.user}
      />
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
   marginBottom:64,
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

export default MyPageMediaTab;
