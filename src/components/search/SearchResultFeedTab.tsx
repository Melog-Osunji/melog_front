import React, {useState} from 'react';
import { ScrollView, Text, Pressable, View, StyleSheet, FlatList, Image } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import { realTimeData } from '@/constants/types'; // 더미 데이터
import PopularMediaCard from '@/components/search/PopularMediaCard';
import PostCard from '@/components/post/PostCard';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';

type Props = { keyword?: string };

const SearchResultFeedTab: React.FC<Props> = ({keyword}) => {
    useHideTabBarOnFocus();
    const feeds = realTimeData ?? [];

    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard {...item} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text style={styles.itemNum}>00,000개</Text>
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
