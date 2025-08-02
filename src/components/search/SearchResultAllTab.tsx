import React from 'react';
import { ScrollView, Text, FlatList } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import {mockPosts} from '@/constants/types'; // 더미 데이터
import PostList from '@/components/post/PostList';
import PopularMediaCard from '@/components/search/PopularMediaCard';
import {PopularMediaData} from '@/constants/types';
import PostCard from '@/components/post/PostCard';


const SearchResultAllTab = () => {
  return (
    <FlatList
          data={mockPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard {...item} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <HeaderContainer>
              <SectionTitle>인기 미디어</SectionTitle>
              <HorizontalList
                data={PopularMediaData}
                keyExtractor={(item, index) => `${item.postID}_${index}`}
                renderItem={({ item }) => <PopularMediaCard data={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
              />
              <SectionTitle style={{ marginTop: 28 }}>실시간 인기 피드</SectionTitle>
            </HeaderContainer>
          }
          contentContainerStyle={{ paddingBottom: 48 }}
        />
  );
};

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-left: 20px;
  color: ${colors.GRAY_600};
`;

const HeaderContainer = styled.View`
  padding: 24px 0px;
  gap: 16px;
`;

const HorizontalList = styled(FlatList).attrs({
  horizontal: true,
})``;

export default SearchResultAllTab;
