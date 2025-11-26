import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NavigationProp} from '@react-navigation/native';
import {PostStackParamList} from '@/navigations/stack/postStackNavigator';
import {colors, postNavigations} from '@/constants';
import EmptyTab from '@/components/search/EmptyTab';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useSearchProfile} from '@/hooks/queries/search/useSearchResult';
import {useFollowUser} from '@/hooks/queries/User/useUserMutations';
import CustomButton from '@/components/common/CustomButton';
import {useQueryClient} from '@tanstack/react-query';

type Props = {keyword?: string};

const SearchResultProfileTab: React.FC<Props> = ({keyword}) => {
  useHideTabBarOnFocus();
  const navigation = useNavigation<NavigationProp<PostStackParamList>>();
  const queryClient = useQueryClient();

  const {data, isLoading, isError} = useSearchProfile(keyword ?? '');
  const followMutation = useFollowUser();

  console.log(data);

  // ───────────────────────────────────────────
  // 로딩 / 에러 핸들링
  // ───────────────────────────────────────────
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

  // ───────────────────────────────────────────
  // 팔로우 토글 핸들러
  // ───────────────────────────────────────────
  const handleToggleFollow = useCallback(
    (userId: string) => {
      followMutation.mutate(userId, {
        onSuccess: () => {
          // ★ React Query 캐시 업데이트
          queryClient.setQueryData(['search', 'profile', keyword], (prev: any) => {
            if (!prev) return prev;

            const updatedUsers = prev.user.map((u: any) =>
              u.userId === userId
                ? {
                    ...u,
                    follow: u.follow === 'T' ? 'F' : 'T',
                  }
                : u,
            );

            return {...prev, user: updatedUsers};
          });
        },
        onError: err => {
          console.warn('[팔로우 실패]', err);
        },
      });
    },
    [followMutation, queryClient, keyword],
  );

  // ───────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {data.user.map((user: any, idx: number) => {
        const isFollowed = user.follow === 'T';

        return (
          <View
            key={user.userId + idx}
            style={[
              styles.item,
              idx === 0 && styles.itemFirst,
              idx === data.user.length - 1 && styles.itemLast,
            ]}>
            <View style={styles.avatar} />
            <Pressable style={styles.textWrap} onPress={()=> navigation.navigate(postNavigations.POST_PROFILE,{userId: user.userId})}>
              <Text style={styles.name}>{user.userNickname}</Text>
              <Text style={styles.bio}>
                {user.intro || '자기소개가 없습니다.'}
              </Text>
            </Pressable>

            <CustomButton
              label={isFollowed ? '팔로잉' : '팔로우'}
              size="small"
              onPress={() => handleToggleFollow(user.userId)}
              style={{
                backgroundColor: isFollowed
                  ? colors.GRAY_200
                  : colors.BLUE_400,
              }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: colors.GRAY_300,
    marginRight: 12,
  },
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
});

export default SearchResultProfileTab;
