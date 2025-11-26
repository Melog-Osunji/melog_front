import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import EmptyTab from '@/components/search/EmptyTab';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useSearchProfile} from '@/hooks/queries/search/useSearchResult';
import {useFollowUser} from '@/hooks/queries/User/useUserMutations';
import {useGetUserFollowing} from '@/hooks/queries/User/useUserQueries';
import CustomButton from '@/components/common/CustomButton';

type Props = {keyword?: string};

const mock: any[] = []; // ← 비었을 때 EmptyState가 보이도록 가정

const SearchResultProfileTab: React.FC<Props> = ({keyword}) => {
  useHideTabBarOnFocus();
  const [isFollow, setIsFollow] = useState<boolean>(false);

  const {data, isLoading, isError} = useSearchProfile(keyword ?? '');

  console.log(data);

  // follow 상태 초기화
  const user = data?.user

  console.log(user);

  const {data: followingData} = useGetUserFollowing(user?.userNickname ?? '');

  // 서버 응답 적용 (data: { isFollowing: boolean })
  useEffect(() => {
    if (followingData) {
        const isFollowing = (followingData as any).result ?? false;
        setIsFollow(!!isFollowing);
    }
  }, [followingData]);

  // 팔로우/언팔로우 토글 핸들러
  const followMutation = useFollowUser();
  const handleToggleFollow = useCallback(() => {
    if (!user?.id) return;

    const previous = isFollow;
    setIsFollow(!previous);

    followMutation.mutate(user.id, {
    onError: () => {
      setIsFollow(previous);
      showToast(
        previous ? '언팔로우에 실패했어요.' : '팔로우에 실패했어요.',
        'error',
      );
    },
    });
  }, [followMutation, user?.id, isFollow]);


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{marginTop: 8, color: colors.GRAY_400}}>불러오는 중…</Text>
      </View>
    );
  }

  if (isError || !data || data.user.length === 0) {
    return <EmptyTab keyword={keyword} fullScreen />;
  }

  if (data.length === 0) {
    return <EmptyTab keyword={keyword} fullScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {data.user.map((user, idx) => {
        const isFollowed = user.follow === 'T';

        return (
          <View
            key={user.userNickname + idx}
            style={[
              styles.item,
              idx === 0 && styles.itemFirst,
              idx === data.user.length - 1 && styles.itemLast,
            ]}>
            <View style={styles.avatar} />
            <View style={styles.textWrap}>
              <Text style={styles.name}>{user.userNickname}</Text>
              <Text style={styles.bio}>
                {user.intro || '자기소개가 없습니다.'}
              </Text>
            </View>

            <CustomButton
                label={isFollow ? '팔로잉' : '팔로우'}
                size="small"
                onPress={handleToggleFollow}
                style={{
                  backgroundColor: isFollow ? colors.GRAY_200 : colors.BLUE_400,
                }}
              />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center:{
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemFirst: {
    paddingTop: 0,
  },
  itemLast: {
    paddingBottom: 0,
  },
  // 왼쪽 아바타(회색 동그라미)
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: colors.GRAY_300,
    marginRight: 12,
  },
  // 텍스트 영역
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.15,
    color: colors.GRAY_600,
  },
  bio: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.GRAY_500,
  },
  // 팔로우 버튼
  followBtn: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.BLUE_400,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followLabel: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.WHITE,
  },
});

export default SearchResultProfileTab;
