import React, {useState} from 'react';
import { ScrollView, Text, Pressable, View, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import PostCard from '@/components/post/PostCard';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import { useSearchFeed } from '@/hooks/queries/search/useSearchResult';
import EmptyTab from '@/components/search/EmptyTab'

type Props = { keyword?: string };

const SearchResultFeedTab: React.FC<Props> = ({keyword}) => {
    useHideTabBarOnFocus();

    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

    const { data, isLoading, isError } = useSearchFeed(keyword);

    console.log(data);

    if (isLoading) {
        return (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: colors.GRAY_400 }}>불러오는 중…</Text>
          </View>
        );
      }

    if (isError || !data) {
      return <EmptyTab keyword={keyword} fullScreen />;
    }

    let feeds = data.resultsRecent ?? [];

    if (sortBy === 'popular') {
        feeds = [...feeds].sort((a, b) => b.post.likeCount - a.post.likeCount);
    } else {
        feeds = [...feeds].sort(
          (a, b) => new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime(),
        );
    }

    if (feeds.length === 0) {
        return (
          <EmptyTab
          keyword={keyword}
          fullScreen
        />
        );
    }

    return (
        <FlatList
            data={feeds}
            keyExtractor={(item) => item.post.id}
            renderItem={({ item }) => <PostCard {...item.post} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text style={styles.itemNum}>{feeds.length}개</Text>
                    <View style={styles.sortWrap}>
                        <Pressable
                          accessibilityRole="button"
                          hitSlop={8}
                          style={styles.sortBtn}
                          onPress={() => setSortBy('latest')}
                        >
                          <Text
                            style={[
                              styles.sortText,
                              sortBy === 'latest' && styles.sortTextActive,
                            ]}
                          >
                            최신순
                          </Text>
                        </Pressable>
                        <Image
                          source={require('@/assets/icons/post/SortLine.png')}
                          style={styles.sortIcon}
                          resizeMode="contain"
                        />

                        <Pressable
                          accessibilityRole="button"
                          hitSlop={8}
                          style={styles.sortBtn}
                          onPress={() => setSortBy('popular')}
                        >
                          <Text
                            style={[
                              styles.sortText,
                              sortBy === 'popular' && styles.sortTextActive,
                            ]}
                          >
                            인기순
                          </Text>
                        </Pressable>
                    </View>
                </View>
            }
            contentContainerStyle={{ paddingBottom: 48 }}
        />
    );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal:20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemNum: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_500,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  sortWrap: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  sortIcon: {
      height: 12,
      marginHorizontal: 4,
  },
  sortText: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.GRAY_300,
      letterSpacing: 0.2,
      lineHeight: 16,
  },
  sortTextActive: {
      color: colors.GRAY_600,
      fontWeight: '600',
  },
  sortBtn: {
      justifyContent: 'center',
      alignItems:'center',
      paddingHorizontal: 4, // 터치 영역 확장
      paddingVertical: 6,
  },

});

export default SearchResultFeedTab;
