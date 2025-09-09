import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import { realTimeData } from '@/constants/types'; // 더미 데이터
import PopularMediaCard from '@/components/search/PopularMediaCard';
import { PopularMediaData } from '@/constants/dummyData';
import PostCard from '@/components/post/PostCard';
import EmptyTab from '@/components/search/EmptyTab'
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';

type Props = { keyword?: string };

const SearchResultAllTab: React.FC<Props> = ({keyword}) => {
    useHideTabBarOnFocus();
    const feeds = realTimeData ?? [];
    const medias: any[] = PopularMediaData ?? [];

    if (feeds.length === 0 && medias.length === 0) {
        return (
          <EmptyTab
          keyword={keyword}
          fullScreen
        />
        );
    }

    return (
    <FlatList
        data={realTimeData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard {...item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
            <View style={styles.headerContainer}>
            <View style={styles.section}>
            <Text style={[styles.sectionTitle, {marginBottom: 24}]}>인기 미디어</Text>

            <FlatList
                data={PopularMediaData}
                keyExtractor={(item, index) => `${item.postID}_${index}`}
                renderItem={({ item }) => <PopularMediaCard data={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListContent}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>실시간 인기 피드</Text>
            </View>
        }
    contentContainerStyle={{ paddingBottom: 48 }}
    />
    );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 20,
    color: colors.GRAY_600,
  },
  headerContainer: {
    paddingVertical: 24,
  },
  section: {
      paddingBottom:24,
      borderBottomWidth: StyleSheet.hairlineWidth, // 또는 1
      borderBottomColor: colors.GRAY_200,
  },
  horizontalListContent: {
    paddingHorizontal: 20,
  },
});

export default SearchResultAllTab;
