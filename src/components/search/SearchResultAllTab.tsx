import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import { realTimeData } from '@/constants/types'; // 더미 데이터
import PopularMediaCard from '@/components/search/PopularMediaCard';
import { PopularMediaData } from '@/constants/types';
import PostCard from '@/components/post/PostCard';

const SearchResultAllTab = () => {
  return (
    <FlatList
      data={realTimeData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard {...item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>인기 미디어</Text>

          <FlatList
            data={PopularMediaData}
            keyExtractor={(item, index) => `${item.postID}_${index}`}
            renderItem={({ item }) => <PopularMediaCard data={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />

          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>실시간 인기 피드</Text>
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
  horizontalListContent: {
    paddingHorizontal: 20,
  },
});

export default SearchResultAllTab;
